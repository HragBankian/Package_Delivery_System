using System.Data;
using Dapper;
using backend.DatabaseClasses;

public interface IDeliveryRequestService
{
    DeliveryRequest CreateDeliveryRequest(int customerId, string pickupLocation, string dropoffLocation, Order order);
}

public class DeliveryRequestService : IDeliveryRequestService
{
    private readonly IDbConnection _dbConnection;

    public DeliveryRequestService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public DeliveryRequest CreateDeliveryRequest(int customerId, string pickupLocation, string dropoffLocation, Order order)
    {
        var deliveryRequest = new DeliveryRequest
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

        // Execute the insert query and retrieve the new ID
        int newDeliveryRequestId = _dbConnection.ExecuteScalar<int>(sql, new
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