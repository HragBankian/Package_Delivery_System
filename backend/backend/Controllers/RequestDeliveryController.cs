using backend.DatabaseClasses;
using backend.DesignPatternSupportClasses;
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
        public IActionResult RequestDelivery([FromQuery] int customerId, [FromQuery]string pickupLocation, [FromQuery]string dropoffLocation, [FromBody]List<Package> packages)
        {
            // Request the delivery and retrieve the tracking number
            DeliveryRequestResponse deliveryRequestResponse = _deliveryFacade.RequestDelivery(customerId, pickupLocation, dropoffLocation, packages);
            return Ok(deliveryRequestResponse);
        }
    }
}

