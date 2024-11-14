using MySql.Data.MySqlClient;
using Dapper;
using backend.DesignPatternSupportClasses.Observer;
using backend.Models;

public interface ITrackingService : ISubject
{
    TrackingModel AddTracking(int deliveryId);
    Guid GenerateTrackingNumber();
    TrackingModel GetTrackingById(Guid trackingNumber);
    void UpdateCurrentLocation(Guid trackingNumber, string newLocation);
}

public class TrackingService : ITrackingService
{
    private readonly IConfiguration _configuration;
    private readonly List<IObserver> _observers = new();

    public TrackingService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public TrackingModel AddTracking(int deliveryId)
    {
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

        // Step 1: Retrieve the pickupLocation from DeliveryRequest using deliveryId
        string getPickupLocationSql = "SELECT pickup_location FROM DeliveryRequest WHERE id = @DeliveryId";
        string pickupLocation = connection.QuerySingleOrDefault<string>(getPickupLocationSql, new { DeliveryId = deliveryId });

        if (pickupLocation == null)
        {
            throw new ArgumentException("Invalid deliveryId. Delivery request not found.");
        }

        // Step 2: Create TrackingModel with retrieved pickupLocation
        var tracking = new TrackingModel
        {
            tracking_number = GenerateTrackingNumber(),
            current_location = pickupLocation,
            estimated_arrival_date = DateTime.Now.AddDays(7) // Assume shipping takes 7 days
        };

        // Step 3: Insert new tracking entry and retrieve the generated ID
        string sql = @"
        INSERT INTO Tracking (tracking_number, current_location, estimated_arrival_date, delivery_request_id)
        VALUES (@tracking_number, @current_location, @estimated_arrival_date, @DeliveryId);
        SELECT LAST_INSERT_ID();";

        int newTrackingId = connection.ExecuteScalar<int>(sql, new
        {
            TrackingNumber = tracking.tracking_number,
            CurrentLocation = tracking.current_location,
            EstimatedArrivalDate = tracking.estimated_arrival_date,
            DeliveryRequestId = deliveryId
        });

        tracking.id = newTrackingId;
        return tracking;
    }


    public Guid GenerateTrackingNumber()
    {
        return Guid.NewGuid();
    }

    public TrackingModel GetTrackingById(Guid trackingNumber)
    {
        string sql = @"
            SELECT id, tracking_number AS trackingNumber, current_location AS currentLocation, 
                   estimated_arrival_date AS estimatedArrivalDate, delivery_request_id AS deliveryRequestId
            FROM Tracking
            WHERE tracking_number = @TrackingNumber;";

        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.QuerySingleOrDefault<TrackingModel>(sql, new { TrackingNumber = trackingNumber });
    }

    public void UpdateCurrentLocation(Guid trackingNumber, string newLocation)
    {
        string sql = "UPDATE Tracking SET current_location = @NewLocation WHERE tracking_number = @TrackingNumber;";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        connection.Execute(sql, new { NewLocation = newLocation, TrackingNumber = trackingNumber });

        NotifyObservers(trackingNumber);
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
            observer.Update("Location Updated", GetTrackingById(trackingNumber)?.current_location);
        }
    }
}
