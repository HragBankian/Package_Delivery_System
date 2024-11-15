using backend.Models;
using backend.Enumerations;
using MySql.Data.MySqlClient;
using Dapper;

namespace backend.Services
{
    public class PaymentFacade
    {
        private readonly PaymentService _paymentService;
        private readonly ITrackingService _trackingService;
        private readonly IConfiguration _configuration;

        public PaymentFacade(PaymentService paymentService, ITrackingService trackingService, IConfiguration configuration)
        {
            _paymentService = paymentService;
            _trackingService = trackingService;
            _configuration = configuration;
        }

        public TrackingModel ProcessPayment(PaymentMethod paymentMethod, String paymentIdentifier, int quotationId)
        {
            // Step 1: Call AddPayment to create a payment
            var payment = _paymentService.AddPayment(paymentMethod, paymentIdentifier, quotationId);
            
            // Step 2: Retrieve the deliveryId from the Quotation using quotationId
            string getDeliveryRequestIdSql = "SELECT delivery_request_id FROM Quotation WHERE id = @QuotationId";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            int deliveryRequestId = connection.QuerySingleOrDefault<int>(getDeliveryRequestIdSql, new { QuotationId = quotationId });

            if (deliveryRequestId == 0)
            {
                throw new ArgumentException("Delivery request not found for the provided quotation ID.");
            }
            
            // Step 3: Add tracking information for the delivery request
            var tracking = _trackingService.AddTracking(deliveryRequestId);
            
            // Step 4: Update the OrderStatus to "Shipped"
            string updateOrderStatusSql = "UPDATE DeliveryRequest SET status = @Status WHERE id = @DeliveryRequestId";
            connection.Execute(updateOrderStatusSql, new { Status = "Shipped", DeliveryRequestId = deliveryRequestId });

            return tracking;
        }
    }
}
