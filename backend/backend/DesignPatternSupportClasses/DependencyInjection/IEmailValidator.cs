using System.Text.RegularExpressions;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using Dapper;

namespace backend.DesignPatternSupportClasses.DependencyInjection
{
    public interface IEmailValidator
    {
        bool IsValid(string email);
        bool AddEmailIsUnique(string email);
        bool EditEmailIsUnique(string email, int customerId);
    }

    public class EmailValidator : IEmailValidator
    {
        private readonly IConfiguration _configuration;

        public EmailValidator(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool IsValid(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            string pattern = @"^[^@\s]+@[^@\s]+\.(com|ca)$";
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }

        public bool AddEmailIsUnique(string email)
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            string sql = "SELECT COUNT(1) FROM Customer WHERE email = @Email";
            int count = connection.ExecuteScalar<int>(sql, new { Email = email });
            return count == 0; // Return true if email is unique
        }

        public bool EditEmailIsUnique(string email, int customerId)
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            string sql = "SELECT COUNT(1) FROM Customer WHERE email = @Email AND id != @Id";
            int count = connection.ExecuteScalar<int>(sql, new { Email = email, Id = customerId });
            return count == 0; // Return true if email is unique
        }
    }
}