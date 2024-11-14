using backend.DatabaseClasses;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrackingController : ControllerBase
    {
        private readonly ITrackingService _trackingService;

        public TrackingController(ITrackingService trackingService)
        {
            _trackingService = trackingService;
        }

        [HttpPost("AddTracking")]
        public IActionResult AddTracking([FromQuery] string pickupLocation, [FromQuery] string dropoffLocation)
        {
            var tracking = _trackingService.AddTracking(pickupLocation, dropoffLocation);
            return Ok(tracking);
        }

        [HttpGet("GenerateTrackingNumber")]
        public IActionResult GenerateTrackingNumber()
        {
            var trackingNumber = _trackingService.GenerateTrackingNumber();
            return Ok(new { trackingNumber });
        }

        [HttpGet("GetCurrentLocation")]
        public IActionResult GetCurrentLocation([FromQuery] Guid trackingNumber)
        {
            var location = _trackingService.GetCurrentLocation(trackingNumber);
            return Ok(new { location });
        }

        [HttpPost("UpdateCurrentLocation")]
        public IActionResult UpdateCurrentLocation([FromQuery] Guid trackingNumber, [FromQuery] string newLocation)
        {
            _trackingService.UpdateCurrentLocation(trackingNumber, newLocation);
            return Ok();
        }

        [HttpGet("GetEstimatedArrivalDate")]
        public IActionResult GetEstimatedArrivalDate([FromQuery] Guid trackingNumber)
        {
            var eta = _trackingService.GetEstimatedArrivalDate(trackingNumber);
            return Ok(new { estimatedArrivalDate = eta });
        }

        [HttpGet("GetTrackingByOrderId")]
        public IActionResult GetTrackingByOrderId([FromQuery] int orderId)
        {
            var tracking = _trackingService.GetTrackingByOrderId(orderId);
            return Ok(tracking);
        }
    }
}
