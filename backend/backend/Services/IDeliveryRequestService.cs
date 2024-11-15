using Dapper;
using backend.Models;
using MySql.Data.MySqlClient;
using backend.Enumerations;

public interface IDeliveryRequestService
{
    DeliveryRequestModel CreateDeliveryRequest(int customerId, string pickupLocation, string dropoffLocation);
    DeliveryRequestModel GetDeliveryRequestById(int deliveryRequestId);
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
            pickup_location = deliveryRequest.pickup_location,
            dropoff_location = deliveryRequest.dropoff_location,
            request_date = deliveryRequest.request_date,
            status = deliveryRequest.status.ToString(),
            customer_id = deliveryRequest.customer_id
        });

        // Assign the generated ID to the delivery request
        deliveryRequest.id = newDeliveryRequestId;

        return deliveryRequest;
    }

    public DeliveryRequestModel GetDeliveryRequestById(int deliveryRequestId)
    {
        string deliveryRequestSql = "SELECT * FROM DeliveryRequest WHERE id = @Id";
        string packagesSql = "SELECT * FROM Package WHERE delivery_request_id = @DeliveryRequestId";

        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

        // Retrieve the delivery request
        var deliveryRequest = connection.QuerySingleOrDefault<DeliveryRequestModel>(deliveryRequestSql, new { Id = deliveryRequestId });

        if (deliveryRequest != null)
        {
            // Retrieve associated packages
            var packages = connection.Query<PackageModel>(packagesSql, new { DeliveryRequestId = deliveryRequestId }).ToList();
            deliveryRequest.packages = packages;
        }

        return deliveryRequest;
    }
}