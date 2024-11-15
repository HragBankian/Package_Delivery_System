using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotationController : ControllerBase
    {
        private readonly IQuotationService _quotationService;

        public QuotationController(IQuotationService quotationService)
        {
            _quotationService = quotationService;
        }

        // Endpoint to create a new quotation
        [HttpPost("create")]
        public IActionResult CreateQuotation([FromQuery] int deliveryRequestId)
        {
            try
            {
                var quotation = _quotationService.AddQuotation(deliveryRequestId); // Calls the service method
                return Ok(quotation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Endpoint to delete a quotation by ID
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteQuotation(int id)
        {
            bool deleted = _quotationService.DeleteQuotation(id);
            if (!deleted)
                return NotFound(new { message = "Quotation not found" });
            return Ok(new { message = "Quotation deleted successfully" });
        }

        // Endpoint to get a quotation by ID
        [HttpGet("{id}")]
        public IActionResult GetQuotationById(int id)
        {
            var quotation = _quotationService.GetQuotationById(id);
            if (quotation == null)
                return NotFound(new { message = "Quotation not found" });
            return Ok(quotation);
        }

        // Endpoint to get all quotations
        [HttpGet("all")]
        public IActionResult GetAllQuotations()
        {
            var quotations = _quotationService.GetAllQuotations();
            return Ok(quotations);
        }
    }
}
