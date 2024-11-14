using backend.DatabaseClasses;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly ITrackingService _trackingService;
        private readonly IOrderService _orderService;

        public OrderController(ITrackingService trackingService, IOrderService orderService)
        {
            _trackingService = trackingService;
            _orderService = orderService;
        }

        // Endpoint to create an order and generate a tracking number
        [HttpPost("createOrder")]
        public IActionResult CreateOrder([FromBody] OrderRequest orderRequest)
        {
            if (orderRequest == null)
            {
                return BadRequest("Invalid order request.");
            }

            // Create a new tracking object
            var tracking = _trackingService.AddTracking(orderRequest.PickupLocation, orderRequest.DropoffLocation);

            // Create the order and associate it with the tracking number
            var order = _orderService.CreateOrder(tracking);

            // Return the order details, including the tracking number
            return Ok(new { orderId = order.id, trackingNumber = tracking.trackingNumber });
        }
    }

    // Request model for the order creation
    public class OrderRequest
    {
        public string PickupLocation { get; set; }
        public string DropoffLocation { get; set; }
    }
}
