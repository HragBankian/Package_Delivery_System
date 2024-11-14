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

        // New endpoint to get the entire tracking information by tracking number
        [HttpGet("GetTrackingById")]
        public IActionResult GetTrackingById([FromQuery] Guid trackingNumber)
        {
            var tracking = _trackingService.GetTrackingById(trackingNumber);
            if (tracking == null)
            {
                return NotFound(new { message = "Tracking not found." });
            }
            return Ok(tracking);
        }

        // Updated endpoint to update the current location of a delivery
        [HttpPost("UpdateCurrentLocation")]
        public IActionResult UpdateCurrentLocation([FromQuery] Guid trackingNumber, [FromQuery] string newLocation)
        {
            _trackingService.UpdateCurrentLocation(trackingNumber, newLocation);
            return Ok(new { message = "Location updated successfully." });
        }
    }
}
