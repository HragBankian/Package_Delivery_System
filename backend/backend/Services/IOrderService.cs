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
    private readonly IDbConnection _dbConnection;

    public OrderService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public Order CreateOrder(Tracking trackingObject)
    {
        var order = new Order
        {
            status = OrderStatus.PaymentPending,
            trackingObject = trackingObject
        };

        string sql = @"
            INSERT INTO Orders (status, trackingNumber)
            VALUES (@Status, @TrackingNumber);
            SELECT LAST_INSERT_ID();"; 
        int newOrderId = _dbConnection.ExecuteScalar<int>(sql, new
        {
            Status = (int)order.status,
            TrackingNumber = trackingObject.trackingNumber
        });

        order.id = newOrderId;

        return order;
    }
}