using System.Data;
using Dapper;
using backend.DatabaseClasses;
using MySql.Data.MySqlClient;

namespace backend.Services;

public interface IOrderService
{
    Order CreateOrder(Tracking trackingObject);
}

public class OrderService : IOrderService
{
    private readonly IConfiguration _configuration;

    public OrderService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Order CreateOrder(Tracking trackingObject)
    {
        var order = new Order
        {
            status = OrderStatus.PaymentPending,
            trackingObject = trackingObject
        };
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        string sql = @"
            INSERT INTO orders (status, trackingNumber)
            VALUES (@Status, @TrackingNumber);
            SELECT LAST_INSERT_ID();"; 
        int newOrderId = connection.ExecuteScalar<int>(sql, new
        {
            Status = (int)order.status,
            TrackingNumber = trackingObject.trackingNumber
        });

        order.id = newOrderId;

        return order;
    }
}