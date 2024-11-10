using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Dapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Controllers;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MyTableController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MyTableController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetMyTableRow")]
        public async Task<ActionResult<IEnumerable<TestTable>>> GetMyTableRow()
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

            var sql = "SELECT * FROM test_table";
            var result = await connection.QueryAsync<TestTable>(sql);

            return Ok(result);
        }
    }
}
