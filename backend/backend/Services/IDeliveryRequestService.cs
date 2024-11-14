using System.Data;
using Dapper;
using backend.DatabaseClasses;
using MySql.Data.MySqlClient;

public interface IDeliveryRequestService
{
    DeliveryRequestModel CreateDeliveryRequest(int customerId, string pickupLocation, string dropoffLocation, OrderModel order);
}

public class DeliveryRequestService : IDeliveryRequestService
{
    private readonly IConfiguration _configuration;

    public DeliveryRequestService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public DeliveryRequestModel CreateDeliveryRequest(int customerId, string pickupLocation, string dropoffLocation, OrderModel order)
    {
        var deliveryRequest = new DeliveryRequestModel
        {
            customerId = customerId,
            pickupLocation = pickupLocation,
            dropoffLocation = dropoffLocation,
            requestDate = DateTime.Now,
            order = order
        };

        // SQL to insert a new delivery request and return the newly created id
        string sql = @"
            INSERT INTO delivery_requests (pickupLocation, dropoffLocation, requestDate, customerId, orderId)
            VALUES (@PickupLocation, @DropoffLocation, @RequestDate, @CustomerId, @OrderId);
            SELECT LAST_INSERT_ID();";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        // Execute the insert query and retrieve the new ID
        int newDeliveryRequestId = connection.ExecuteScalar<int>(sql, new
        {
            PickupLocation = deliveryRequest.pickupLocation,
            DropoffLocation = deliveryRequest.dropoffLocation,
            RequestDate = deliveryRequest.requestDate,
            CustomerId = deliveryRequest.customerId,
            OrderId = deliveryRequest.order.id
        });

        // Assign the generated ID to the delivery request
        deliveryRequest.id = newDeliveryRequestId;

        return deliveryRequest;
    }
}