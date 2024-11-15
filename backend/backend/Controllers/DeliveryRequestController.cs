using backend.DesignPatternSupportClasses.Facade;
using backend.Models;
using Microsoft.AspNetCore.Mvc;



namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryRequestService _deliveryRequestService;
        private readonly DeliveryFacade _deliveryFacade;

        public DeliveryController(IDeliveryRequestService deliveryRequestService, DeliveryFacade deliveryFacade)
        {
            _deliveryRequestService = deliveryRequestService;
            _deliveryFacade = deliveryFacade;
        }

        [HttpPost("deliveryRequest")]
        public IActionResult RequestDelivery([FromQuery] int customerId, [FromQuery]string pickupLocation, [FromQuery]string dropoffLocation, [FromBody]List<PackageModel> packages)
        {
            // Request the delivery and retrieve the tracking number
            int deliveryRequestResponse = _deliveryFacade.RequestDelivery(customerId, pickupLocation, dropoffLocation, packages);
            return Ok(deliveryRequestResponse);
        }

        [HttpGet("deliveryRequest/{id}")]
        public IActionResult GetDeliveryRequestId(int id)
        {
            var deliveryRequest = _deliveryRequestService.GetDeliveryRequestById(id);
            if (deliveryRequest == null)
            {
                return NotFound(new { message = "Delivery request not found." });
            }
            return Ok(deliveryRequest);
        }
    }
}

