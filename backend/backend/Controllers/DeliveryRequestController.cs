using backend.DesignPatternSupportClasses.Facade;
using backend.Models;
using Microsoft.AspNetCore.Mvc;



namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DeliveryController : ControllerBase
    {
        private readonly DeliveryFacade _deliveryFacade;

        public DeliveryController(DeliveryFacade deliveryFacade)
        {
            _deliveryFacade = deliveryFacade;
        }

        [HttpPost("deliveryRequest")]
        public IActionResult RequestDelivery([FromQuery] int customerId, [FromQuery]string pickupLocation, [FromQuery]string dropoffLocation, [FromBody]List<PackageModel> packages)
        {
            // Request the delivery and retrieve the tracking number
            int deliveryRequestResponse = _deliveryFacade.RequestDelivery(customerId, pickupLocation, dropoffLocation, packages);
            return Ok(deliveryRequestResponse);
        }
    }
}

