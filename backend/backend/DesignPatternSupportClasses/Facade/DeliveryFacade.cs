using backend.Models;
using backend.Services;

namespace backend.DesignPatternSupportClasses.Facade
{
    public class DeliveryFacade
    {
        private readonly IDeliveryRequestService _deliveryRequestService;
        private readonly ITrackingService _trackingService;
        private readonly IPackageService _packagesService;

        public DeliveryFacade(IDeliveryRequestService deliveryRequestService, ITrackingService trackingService, IPackageService packageService)
        {
            _deliveryRequestService = deliveryRequestService;
            _trackingService = trackingService;
            _packagesService = packageService;
        }

        public int RequestDelivery(int customerId, string pickupLocation, string dropoffLocation, List<PackageModel> packages)
        {
            DeliveryRequestModel deliveryRequest = _deliveryRequestService.CreateDeliveryRequest(customerId, pickupLocation, dropoffLocation);
            if (deliveryRequest.Equals(null))
            {
                throw new InvalidOperationException("Failed to create delivery request.");
            }
            bool createPackagesSuccess = _packagesService.CreatePackages(packages, deliveryRequest.id);

            if (createPackagesSuccess)
            {
                return deliveryRequest.id;
            }
            throw new InvalidOperationException("Failed to create packages.");
        }
    }
}
