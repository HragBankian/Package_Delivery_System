using backend.Services;
using backend.DatabaseClasses;
using Microsoft.AspNetCore.Mvc;
using System;
using Dapper;
using MySql.Data.MySqlClient;
using backend.DesignPatternSupportClasses.DependencyInjection;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IEmailValidator _emailValidator;
        private readonly IConfiguration _configuration;

        public PaymentController(IPaymentService paymentService, IEmailValidator emailValidator, IConfiguration configuration)
        {
            _paymentService = paymentService;
            _emailValidator = emailValidator;
            _configuration = configuration;
        }

        [HttpPost("process")]
        public IActionResult ProcessPayment([FromQuery] string trackingNumber, [FromQuery] string paymentMethod, [FromQuery] string paymentDetails, [FromQuery] double amount)
        {
            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

                // Step 0: Validate trackingNumber format (UUID format)
                if (trackingNumber.Length != 36 || !Guid.TryParse(trackingNumber, out _))
                {
                    return BadRequest(new { message = "Invalid tracking number format. It should be in UUID format (e.g., 00000000-0000-0000-0000-000000000000)." });
                }

                // Step 1: Find the Order using trackingNumber
                string orderQuery = "SELECT * FROM orders WHERE trackingNumber = @TrackingNumber";
                var order = connection.QuerySingleOrDefault<OrderModel>(orderQuery, new { TrackingNumber = trackingNumber });

                if (order == null)
                {
                    return BadRequest(new { message = "Invalid tracking number. Order not found." });
                }

                // Step 2: Find the DeliveryRequest using the orderId from the Order
                string deliveryRequestQuery = "SELECT * FROM delivery_requests WHERE orderId = @OrderId";
                var deliveryRequest = connection.QuerySingleOrDefault<DeliveryRequestModel>(deliveryRequestQuery, new { OrderId = order.id });

                if (deliveryRequest == null)
                {
                    return BadRequest(new { message = "Delivery request not found for the given order." });
                }

                // Step 3: Find the Quotation using deliveryRequestId
                string quotationQuery = "SELECT * FROM quotations WHERE deliveryRequestId = @DeliveryRequestId";
                var quotation = connection.QuerySingleOrDefault<QuotationModel>(quotationQuery, new { DeliveryRequestId = deliveryRequest.id });

                if (quotation == null)
                {
                    return BadRequest(new { message = "Quotation not found for the given delivery request." });
                }

                // Retrieve the quote amount from the Quotation
                double quoteAmount = quotation.QuoteAmount;

                // Step 4: Validate the entered amount matches the quote amount
                if (amount != quoteAmount)
                {
                    return BadRequest(new { message = "The entered amount does not match the quotation amount." });
                }

                // Step 5: Validate payment details based on payment method
                bool isValid = false;
                if (paymentMethod.Equals("CreditCard", StringComparison.OrdinalIgnoreCase))
                {
                    // For CreditCard, paymentDetails should be a 16-digit number
                    isValid = paymentDetails.Length == 16 && paymentDetails.All(char.IsDigit);
                    if (!isValid)
                    {
                        return BadRequest(new { message = "Invalid credit card number. It must be 16 digits long." });
                    }
                }
                else if (paymentMethod.Equals("PayPal", StringComparison.OrdinalIgnoreCase))
                {
                    // For PayPal, validate that paymentDetails is a valid email
                    isValid = _emailValidator.IsValid(paymentDetails);
                    if (!isValid)
                    {
                        return BadRequest(new { message = "Invalid PayPal email address." });
                    }
                }
                else
                {
                    return BadRequest(new { message = "Unsupported payment method. Please use 'CreditCard' or 'PayPal'." });
                }

                // Step 6: Insert payment into the database with the quote amount
                string paymentInsertQuery = "INSERT INTO payments (amount, paymentDate, paymentMethod, quotationId) VALUES (@Amount, @PaymentDate, @PaymentMethod, @QuotationId)";
                connection.Execute(paymentInsertQuery, new
                {
                    Amount = quoteAmount, // Use the retrieved quoteAmount
                    PaymentDate = DateTime.Now,
                    PaymentMethod = paymentMethod,
                    QuotationId = quotation.Id // Link to the found quotation
                });

                return Ok(new { message = "Payment processed successfully", quoteAmount });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
