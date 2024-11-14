using backend.DatabaseClasses;
using MySql.Data.MySqlClient;
using Dapper;
using backend.DesignPatternSupportClasses.Observer;
using System;

public interface ITrackingService : ISubject
{
    TrackingModel AddTracking(string pickupLocation, string dropoffLocation);
    Guid GenerateTrackingNumber();
    string GetCurrentLocation(Guid trackingNumber);
    void UpdateCurrentLocation(Guid trackingNumber, string newLocation);
    DateTime GetEstimatedArrivalDate(Guid trackingNumber);
    TrackingModel GetTrackingByOrderId(int orderId);
}

public class TrackingService : ITrackingService
{
    private readonly IConfiguration _configuration;
    private readonly List<IObserver> _observers = new();

    public TrackingService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public TrackingModel AddTracking(string pickupLocation, string dropoffLocation)
    {
        var tracking = new TrackingModel
        {
            trackingNumber = GenerateTrackingNumber(),
            currentLocation = pickupLocation,
            estimatedArrivalDate = DateTime.Now.AddDays(5)  // Example ETA calculation
        };

        string sql = @"
            INSERT INTO tracking (trackingNumber, currentLocation, estimatedArrivalDate)
            VALUES (@TrackingNumber, @CurrentLocation, @EstimatedArrivalDate);
            SELECT LAST_INSERT_ID();";

        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        int newTrackingId = connection.ExecuteScalar<int>(sql, tracking);

        tracking.id = newTrackingId;
        return tracking;
    }

    public Guid GenerateTrackingNumber()
    {
        return Guid.NewGuid();
    }

    public string GetCurrentLocation(Guid trackingNumber)
    {
        string sql = "SELECT currentLocation FROM tracking WHERE trackingNumber = @TrackingNumber;";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.QuerySingleOrDefault<string>(sql, new { TrackingNumber = trackingNumber });
    }

    public void UpdateCurrentLocation(Guid trackingNumber, string newLocation)
    {
        string sql = "UPDATE tracking SET currentLocation = @NewLocation WHERE trackingNumber = @TrackingNumber;";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        connection.Execute(sql, new { NewLocation = newLocation, TrackingNumber = trackingNumber });

        NotifyObservers(trackingNumber);
    }

    public DateTime GetEstimatedArrivalDate(Guid trackingNumber)
    {
        string sql = "SELECT estimatedArrivalDate FROM tracking WHERE trackingNumber = @TrackingNumber;";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.QuerySingleOrDefault<DateTime>(sql, new { TrackingNumber = trackingNumber });
    }

    public TrackingModel GetTrackingByOrderId(int orderId)
    {
        string sql = @"
            SELECT * FROM tracking WHERE id = (
                SELECT trackingId FROM orders WHERE id = @OrderId
            );";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.QuerySingleOrDefault<TrackingModel>(sql, new { OrderId = orderId });
    }

    // Observer Pattern Implementation
    public void RegisterObserver(IObserver observer)
    {
        _observers.Add(observer);
    }

    public void RemoveObserver(IObserver observer)
    {
        _observers.Remove(observer);
    }

    public void NotifyObservers(Guid trackingNumber)
    {
        foreach (var observer in _observers)
        {
            // Update each observer with relevant tracking status
            observer.Update("Location Updated", GetCurrentLocation(trackingNumber));
        }
    }
}
