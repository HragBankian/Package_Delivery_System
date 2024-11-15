using backend.Models;
using backend.Enumerations;
using MySql.Data.MySqlClient;
using Dapper;
using backend.DesignPatternSupportClasses.DependencyInjection;

namespace backend.Services
{
    public interface IPaymentService
    {
        bool ProcessPaymentType(double amount, string paymentIdentifier);
    }

    public class PaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly ITrackingService _trackingService;

        public PaymentService(IConfiguration configuration, ITrackingService trackingService)
        {
            _configuration = configuration;
            _trackingService = trackingService;
        }

        public PaymentModel AddPayment(PaymentMethod paymentMethod, String paymentIdentifier, int quotationId)
        {
            // Here, assume that the payment amount is retrieved from the quotation
            double amount = GetQuotationAmount(quotationId);
      
            bool isPaymentValid = paymentMethod switch
            {
                PaymentMethod.CreditCard => new CreditCardPayment().ProcessPaymentType(amount, paymentIdentifier),
                PaymentMethod.PayPal => new PayPalPayment(new EmailValidator(_configuration)).ProcessPaymentType(amount, paymentIdentifier),
                _ => false
            };

            if (!isPaymentValid)
            {
                throw new ArgumentException("Payment failed due to invalid details.");
            }

            var payment = new PaymentModel
            {
                payment_date = DateTime.Now,
                payment_method = paymentMethod,
                quotation_id = quotationId
            };
            
            // SQL to insert payment into the database
            string sql = @"
                INSERT INTO Payment (payment_date, payment_method, quotation_id)
                VALUES (@payment_date, @payment_method, @quotation_id);
                SELECT LAST_INSERT_ID();";
            
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            
            payment.id = connection.ExecuteScalar<int>(sql, new
            {
                payment_date = payment.payment_date,
                payment_method = payment.payment_method.ToString(),
                quotation_id = payment.quotation_id
            });
            
            return payment;
        }

        private double GetQuotationAmount(int quotationId)
        {
            // Retrieve the amount from the quotation database based on the quotationId
            string sql = "SELECT quote_amount FROM Quotation WHERE id = @QuotationId";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.QuerySingleOrDefault<double>(sql, new { QuotationId = quotationId });
        }
    }
}
