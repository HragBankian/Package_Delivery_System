﻿using backend.DatabaseClasses;
using MySql.Data.MySqlClient;
using Dapper;
using backend.DatabaseClasses;
using System;

public interface ITrackingService
{
    Tracking AddTracking(string pickupLocation, string dropoffLocation);
    Guid GenerateTrackingNumber();
    string GetCurrentLocation(Guid trackingNumber);
    void UpdateCurrentLocation(Guid trackingNumber, string newLocation);
    DateTime GetEstimatedArrivalDate(Guid trackingNumber);
    Tracking GetTrackingByOrderId(int orderId);
}

public class TrackingService : ITrackingService
{
    private readonly IConfiguration _configuration;

    public TrackingService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Tracking AddTracking(string pickupLocation, string dropoffLocation)
    {
        var tracking = new Tracking
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
    }

    public DateTime GetEstimatedArrivalDate(Guid trackingNumber)
    {
        string sql = "SELECT estimatedArrivalDate FROM tracking WHERE trackingNumber = @TrackingNumber;";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.QuerySingleOrDefault<DateTime>(sql, new { TrackingNumber = trackingNumber });
    }

    public Tracking GetTrackingByOrderId(int orderId)
    {
        string sql = @"
            SELECT * FROM tracking WHERE id = (
                SELECT trackingId FROM orders WHERE id = @OrderId
            );";
        using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
        return connection.QuerySingleOrDefault<Tracking>(sql, new { OrderId = orderId });
    }
}
