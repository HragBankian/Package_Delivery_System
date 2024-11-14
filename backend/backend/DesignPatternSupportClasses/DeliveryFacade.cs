using backend.DatabaseClasses;
using backend.Services;
using MySql.Data.MySqlClient;

namespace backend.DesignPatternSupportClasses;

public class DeliveryFacade
{
    private readonly IDeliveryRequestService _deliveryRequestService;
    private readonly IOrderService _orderService;
    private readonly ITrackingService _trackingService;
    private readonly IPackageService _packagesService;

    public DeliveryFacade(IDeliveryRequestService deliveryRequestService, IOrderService orderService, ITrackingService trackingService, IPackageService packageService)
    {
        _deliveryRequestService = deliveryRequestService;
        _orderService = orderService;
        _trackingService = trackingService;
        _packagesService = packageService;
    }

    public Guid RequestDelivery(int customerId, string pickupLocation, string dropoffLocation, List<Package> packages)
    {
        //not dealing with tracking for now, but it HAS to return a Tracking object 
        Tracking tracking = _trackingService.AddTracking(pickupLocation, dropoffLocation);
        if (tracking.Equals(null))
        {
            throw new InvalidOperationException("Failed to create tracking for the order.");
        }
        Order order = _orderService.CreateOrder(tracking);
        if (order.Equals(null))
        {
            throw new InvalidOperationException("Failed to create order.");
        }
        DeliveryRequest deliveryRequest = _deliveryRequestService.CreateDeliveryRequest(customerId, pickupLocation, dropoffLocation, order);
        if (deliveryRequest.Equals(null))
        {
            throw new InvalidOperationException("Failed to create delivery request."); 
        }
        bool createPackagesSuccess = _packagesService.CreatePackages(packages, deliveryRequest.id);
        //returns tracking number in response
        if (createPackagesSuccess)
        {
            return tracking.trackingNumber;
        }
        throw new InvalidOperationException("Failed to create packages.");
        
        
    }
}
