using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrackingHistoryController : ControllerBase
    {
        private readonly ITrackingHistoryService _trackingHistoryService;

        public TrackingHistoryController(ITrackingHistoryService trackingHistoryService)
        {
            _trackingHistoryService = trackingHistoryService;
        }

        [HttpGet("getTrackingHistoryByTrackingNumber")]
        public IActionResult GetTrackingHistoryByTrackingNumber([FromQuery] string trackingNumber)
        {
            if (string.IsNullOrEmpty(trackingNumber))
            {
                return BadRequest(new { message = "Tracking number must be provided." });
            }

            try
            {
                var locations = _trackingHistoryService.getTrackingHistoryByTrackingNumber(trackingNumber);
                if (locations == null || !locations.Any())
                {
                    return NotFound(new { message = "No tracking history found for the given tracking number." });
                }

                return Ok(locations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving tracking history.", error = ex.Message });
            }
        }
    }
}
