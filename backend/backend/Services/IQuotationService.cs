using MySql.Data.MySqlClient;
using Dapper;
using backend.Models;
using backend.Enumerations;

namespace backend.Services {
    public interface IQuotationService
    {
        QuotationModel AddQuotation(int deliveryRequestId);
        bool DeleteQuotation(int id);
        QuotationModel GetQuotationById(int id);
        IEnumerable<QuotationModel> GetAllQuotations();
        double CalculateQuoteAmount(int deliveryRequestId);
        QuotationModel GetQuotationByDeliveryRequestId(int deliveryRequestId);
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
                quote_amount = quoteAmount,
                quote_date = DateTime.Now,
                delivery_request_id = deliveryRequestId
            };

            string sql = "INSERT INTO Quotation (quote_amount, quote_date, delivery_request_id) VALUES (@quote_amount, @quote_date, @delivery_request_id); SELECT LAST_INSERT_ID();";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            quotation.id = connection.ExecuteScalar<int>(sql, quotation);

            // Step 3: Return the quotation with quoteAmount
            return quotation;
        }

        public bool DeleteQuotation(int id)
        {
            string sql = "DELETE FROM Quotation WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Execute(sql, new { Id = id }) > 0;
        }

        public QuotationModel GetQuotationById(int id)
        {
            string sql = "SELECT * FROM Quotation WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.QuerySingleOrDefault<QuotationModel>(sql, new { Id = id });
        }

        public IEnumerable<QuotationModel> GetAllQuotations()
        {
            string sql = "SELECT * FROM Quotation";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Query<QuotationModel>(sql).ToList();
        }

        public double CalculateQuoteAmount(int deliveryRequestId)
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

            // Retrieve packages for the given deliveryRequestId
            var packages = connection.Query<PackageModel>(
                "SELECT weight, length, width, height, category, is_fragile FROM Package WHERE delivery_request_id = @DeliveryRequestId",
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
                if (package.is_fragile)
                {
                    packageQuote += 10.0;
                }

                // Accumulate the package quote to the total quote amount
                totalQuoteAmount += packageQuote;
            }

            return totalQuoteAmount;
        }

        public QuotationModel GetQuotationByDeliveryRequestId(int deliveryRequestId)
        {
            // SQL query to retrieve the quotation by deliveryRequestId
            string sql = @"
                SELECT id, delivery_request_id, quote_amount, quote_date
                FROM Quotation
                WHERE delivery_request_id = @DeliveryRequestId;
            ";

            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            var quotation = connection.QuerySingleOrDefault<QuotationModel>(sql, new { DeliveryRequestId = deliveryRequestId });

            if (quotation == null)
            {
                throw new KeyNotFoundException("Quotation not found for the specified delivery request ID.");
            }

            return quotation;
        }
    }
}