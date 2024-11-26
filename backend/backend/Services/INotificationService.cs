using backend.DesignPatternSupportClasses.Observer;
using backend.Models;
using Dapper;
using MySql.Data.MySqlClient;
using System;
using System.Net.Mail;
namespace backend.Services
{
    public interface INotificationService : IObserver
    {
        void Update(string message, TrackingModel tracking);

    }

    

    public class NotificationService : INotificationService
    {
        private readonly IEmailService _emailService; // Assuming an email service is available
        private readonly IConfiguration _configuration;

        public NotificationService(IEmailService emailService, IConfiguration configuration)
        {
            _emailService = emailService;
            _configuration = configuration;
        }

        // Update method is called whenever the tracking location changes
        public void Update(string message, TrackingModel tracking)
        {
            Console.WriteLine("Sending update email...");

            // Get user email based on delivery_request_id (example logic)
            string userEmail = GetUserEmailByDeliveryRequestId(tracking.delivery_request_id);

            if (!string.IsNullOrEmpty(userEmail))
            {
                
                string subject = "Your package is on the move!";
                string body = $@"
                    <p>Your package with <strong>tracking number: {tracking.tracking_number}</strong> has been updated.</p>
                    <p>Current Location: <strong>{tracking.current_location}</strong></p>
                    <p>Estimated Arrival Date:<strong> {tracking.estimated_arrival_date.ToShortDateString()}</strong></p>
                    <p>Thank you for using our service!<br>
                    - The Omnivox 2 Team</p>";

                _emailService.SendEmail(userEmail, subject, body);
            }
        }

        private string GetUserEmailByDeliveryRequestId(int deliveryRequestId)
        {
            // Query to retrieve customer_id using deliveryRequestId
            string getCustomerIdSql = "SELECT customer_id FROM DeliveryRequest WHERE id = @DeliveryRequestId";

            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

            int customerId = connection.QuerySingleOrDefault<int>(getCustomerIdSql, new { DeliveryRequestId = deliveryRequestId });

            if (customerId == 0)
            {
                throw new ArgumentException($"Delivery request with ID {deliveryRequestId} not found.");
            }

            // Query to retrieve email from Customer table using customer_id
            string getEmailSql = "SELECT email FROM Customer WHERE id = @CustomerId";

            string email = connection.QuerySingleOrDefault<string>(getEmailSql, new { CustomerId = customerId });

            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException($"Customer with ID {customerId} does not have a registered email.");
            }

            return email;
        }
    }



}
