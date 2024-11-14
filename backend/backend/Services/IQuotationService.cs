using backend.DatabaseClasses;
using MySql.Data.MySqlClient;
using Dapper;

namespace backend.Services {
    public interface IQuotationService
    {
        QuotationModel AddQuotation(int deliveryRequestId);
        bool DeleteQuotation(int id);
        QuotationModel GetQuotationById(int id);
        IEnumerable<QuotationModel> GetAllQuotations();
        double CalculateQuoteAmount(int deliveryRequestId); 
    }


    public class QuotationService : IQuotationService
    {
        private readonly IConfiguration _configuration;

        public QuotationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public QuotationModel AddQuotation(int deliveryRequestId)
        {
            // Step 1: Calculate the quote amount based on packages
            double quoteAmount = CalculateQuoteAmount(deliveryRequestId);

            // Step 2: Insert the quotation record into the database
            var quotation = new QuotationModel
            {
                QuoteAmount = quoteAmount,
                QuoteDate = DateTime.Now,
                DeliveryRequestId = deliveryRequestId
            };

            string sql = "INSERT INTO quotations (quoteAmount, quoteDate, deliveryRequestId) VALUES (@QuoteAmount, @QuoteDate, @DeliveryRequestId); SELECT LAST_INSERT_ID();";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            quotation.Id = connection.ExecuteScalar<int>(sql, quotation);

            // Step 3: Return the quotation with quoteAmount
            return quotation;
        }

        public bool DeleteQuotation(int id)
        {
            string sql = "DELETE FROM quotations WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Execute(sql, new { Id = id }) > 0;
        }

        public QuotationModel GetQuotationById(int id)
        {
            string sql = "SELECT * FROM quotations WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.QuerySingleOrDefault<QuotationModel>(sql, new { Id = id });
        }

        public IEnumerable<QuotationModel> GetAllQuotations()
        {
            string sql = "SELECT * FROM quotations";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Query<QuotationModel>(sql).ToList();
        }

        public double CalculateQuoteAmount(int deliveryRequestId)
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

            // Retrieve packages for the given deliveryRequestId
            var packages = connection.Query<PackageModel>(
                "SELECT weight, length, width, height, category, isFragile FROM packages WHERE deliveryRequestId = @DeliveryRequestId",
                new { DeliveryRequestId = deliveryRequestId });

            double totalQuoteAmount = 0.0;

            foreach (var package in packages)
            {
                // Base price for each package
                double packageQuote = 50.0;

                // Add extra cost based on weight (e.g., $2 per kilogram)
                packageQuote += package.weight * 2.0;

                // Category-based charges
                switch (package.category)
                {
                    case PackageCategory.Hazardous:
                        packageQuote += 30.0; // Additional charge for hazardous items
                        break;
                    case PackageCategory.Valuable:
                        packageQuote += 20.0; // Additional charge for valuable items
                        break;
                    case PackageCategory.Standard:
                    default:
                        break;
                }

                // Additional charge for fragile items
                if (package.isFragile)
                {
                    packageQuote += 10.0;
                }

                // Accumulate the package quote to the total quote amount
                totalQuoteAmount += packageQuote;
            }

            return totalQuoteAmount;
        }
    }
}