using Dapper;
using backend.Models;
using MySql.Data.MySqlClient;
using backend.Enumerations;

public interface IDeliveryRequestService
{
    DeliveryRequestModel CreateDeliveryRequest(int customerId, string pickupLocation, string dropoffLocation);
}

public class DeliveryRequestService : IDeliveryRequestService
{
    private readonly IConfiguration _configuration;

    public DeliveryRequestService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public DeliveryRequestModel CreateDeliveryRequest(int customerId, string pickupLocation, string dropoffLocation)
    {
        var deliveryRequest = new DeliveryRequestModel
        {
            customer_id = customerId,
            pickup_location = pickupLocation,
            dropoff_location = dropoffLocation,
            request_date = DateTime.Now,
            status = OrderStatus.PaymentPending
        };

        // SQL to insert a new delivery request and return the newly created id
        string sql = @"
            INSERT INTO DeliveryRequest (pickup_location, dropoff_location, request_date, status, customer_id)
            VALUES (@pickup_location, @dropoff_location, @request_date, @status, @customer_id);
            SELECT LAST_INSERT_ID();";

        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        // Execute the insert query and retrieve the new ID
        int newDeliveryRequestId = connection.ExecuteScalar<int>(sql, new
        {
            PickupLocation = deliveryRequest.pickup_location,
            DropoffLocation = deliveryRequest.dropoff_location,
            RequestDate = deliveryRequest.request_date,
            Status = deliveryRequest.status.ToString(),
            CustomerId = deliveryRequest.customer_id
        });

        // Assign the generated ID to the delivery request
        deliveryRequest.id = newDeliveryRequestId;

        return deliveryRequest;
    }
}