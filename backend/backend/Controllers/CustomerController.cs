namespace backend.Controllers
{
    using global::backend.Models;
    using global::backend.Services;
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;

    namespace backend.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class CustomerController : ControllerBase
        {
            private readonly ICustomerService _customerService;

            public CustomerController(ICustomerService customerService)
            {
                _customerService = customerService;
            }

            [HttpPost("login")]
            public IActionResult CustomerLogin(string email, string password)
            {
                var customer = _customerService.CustomerLogin(email, password);

                if (customer != null)
                {
                    // Login successful, return the customer details
                    return Ok(customer);
                }
                else
                {
                    // Login failed
                    return Unauthorized(new { message = "Invalid email or password" });
                }
            }

            [HttpPost("add")]
            public IActionResult AddCustomer(string fullName, string address, string email, string password)
            {
                try
                {
                    var customer = _customerService.AddCustomer(fullName, address, email, password);
                    return Ok(customer);
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }

            [HttpDelete("delete/{id}")]
            public IActionResult DeleteCustomer(int id)
            {
                bool deleted = _customerService.DeleteCustomer(id);
                if (!deleted) return NotFound();
                return Ok(new { message = "Customer deleted successfully" });
            }

            [HttpGet("{id}")]
            public IActionResult GetCustomerById(int id)
            {
                var customer = _customerService.GetCustomerById(id);
                if (customer == null) return NotFound();
                return Ok(customer);
            }

            [HttpGet("all")]
            public IEnumerable<CustomerModel> GetAllCustomers()
            {
                return _customerService.GetAllCustomers();
            }

            [HttpPut("edit/{id}")]
            public IActionResult EditCustomer(int id, string fullName, string address, string email, string password)
            {
                try
                {
                    var customer = _customerService.EditCustomer(id, fullName, address, email, password);
                    return Ok(customer);
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }
    }

}
