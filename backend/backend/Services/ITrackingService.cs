using MySql.Data.MySqlClient;
using Dapper;
using backend.DesignPatternSupportClasses.Observer;
using backend.Models;
using backend.Services;
using backend.Enumerations;

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
    private readonly IObserver _observer;

    public TrackingService(IConfiguration configuration)
    {
        _configuration = configuration;
        IEmailService emailService = new SmtpEmailService(_configuration);  // Assuming you have an EmailService class
        _observer = new NotificationService(emailService, _configuration);
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
            estimated_arrival_date = DateTime.Now.AddDays(7), // Assume shipping takes 7 days
            delivery_request_id = deliveryId
        };

        // Step 3: Insert new tracking entry and retrieve the generated ID
        string insertTrackingSql = @"
            INSERT INTO Tracking (tracking_number, current_location, estimated_arrival_date, delivery_request_id)
            VALUES (@tracking_number, @current_location, @estimated_arrival_date, @delivery_request_id);
            SELECT LAST_INSERT_ID();";

        int newTrackingId = connection.ExecuteScalar<int>(insertTrackingSql, new
        {
            tracking_number = tracking.tracking_number,
            current_location = tracking.current_location,
            estimated_arrival_date = tracking.estimated_arrival_date,
            delivery_request_id = deliveryId
        });

        tracking.id = newTrackingId;

        // Step 4: Add the current_location as a row in the TrackingHistory table
        string insertTrackingHistorySql = @"
            INSERT INTO TrackingHistory (location, tracking_id)
            VALUES (@location, @tracking_id);";

        connection.Execute(insertTrackingHistorySql, new
        {
            location = tracking.current_location,
            tracking_id = newTrackingId
        });

        return tracking;
    }

    public Guid GenerateTrackingNumber()
    {
        return Guid.NewGuid();
    }

    public TrackingModel GetTrackingById(Guid trackingNumber)
    {
        string sql = @"
        SELECT id, tracking_number, current_location, 
               estimated_arrival_date, delivery_request_id
        FROM Tracking
        WHERE tracking_number = @trackingNumber;";

        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.QuerySingleOrDefault<TrackingModel>(sql, new { trackingNumber });
    }

    public void UpdateCurrentLocation(Guid trackingNumber, string newLocation)
    {
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

        // Step 1: Retrieve the associated DeliveryRequest's dropoff_location, delivery_request_id, and status
        string getDeliveryRequestSql = @"
        SELECT dr.id AS DeliveryRequestId, dr.dropoff_location AS DropoffLocation, dr.status AS OrderStatus
        FROM DeliveryRequest dr
        JOIN Tracking t ON dr.id = t.delivery_request_id
        WHERE t.tracking_number = @TrackingNumber;";

        var result = connection.QuerySingle(
            getDeliveryRequestSql,
            new { TrackingNumber = trackingNumber }
        );

        // Extract values from the result
        int deliveryRequestId = result.DeliveryRequestId;
        string dropoffLocation = result.DropoffLocation;
        string orderStatus = result.OrderStatus;

        // Step 2: Check if the OrderStatus is already "Delivered"
        if (orderStatus == OrderStatus.Delivered.ToString())
        {
            throw new InvalidOperationException("Cannot update location. The order has already been delivered.");
        }

        // Step 3: Update the Tracking's current_location
        string updateTrackingSql = "UPDATE Tracking SET current_location = @NewLocation WHERE tracking_number = @TrackingNumber;";
        connection.Execute(updateTrackingSql, new { NewLocation = newLocation, TrackingNumber = trackingNumber });

        // Step 4: Insert the new location into the TrackingHistory table
        string insertTrackingHistorySql = @"
        INSERT INTO TrackingHistory (location, tracking_id) 
        VALUES (@NewLocation, (SELECT id FROM Tracking WHERE tracking_number = @TrackingNumber));";
        connection.Execute(insertTrackingHistorySql, new { NewLocation = newLocation, TrackingNumber = trackingNumber });

        // Step 5: If the new location matches the dropoff location, update DeliveryRequest status
        if (newLocation == dropoffLocation)
        {
            string updateStatusSql = "UPDATE DeliveryRequest SET status = @Status WHERE id = @DeliveryRequestId;";
            connection.Execute(updateStatusSql, new { Status = OrderStatus.Delivered.ToString(), DeliveryRequestId = deliveryRequestId });
        }

        //get tracking model and pass to notify observers
        NotifyObservers(trackingNumber);
    }

    public void NotifyObservers(Guid trackingNumber)
    {
        _observer.Update("Location Updated", GetTrackingById(trackingNumber));
    }
}
