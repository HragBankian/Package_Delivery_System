using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Enumerations;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentFacade _paymentFacade;

        public PaymentController(PaymentFacade paymentFacade)
        {
            _paymentFacade = paymentFacade;
        }

        // API endpoint to process payment
        [HttpPost("ProcessPayment")]
        public IActionResult ProcessPayment([FromQuery] PaymentMethod paymentMethod, [FromQuery] String paymentIdentifier, [FromQuery] int quotationId)
        {
            try
            {
                var tracking = _paymentFacade.ProcessPayment(paymentMethod, paymentIdentifier, quotationId);
                return Ok(new { tracking });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
