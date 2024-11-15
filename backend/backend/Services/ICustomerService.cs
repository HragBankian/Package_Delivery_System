using backend.DesignPatternSupportClasses.DependencyInjection;
using MySql.Data.MySqlClient;
using Dapper;
using backend.Models;

namespace backend.Services
{
    public interface ICustomerService
    {
        CustomerModel CustomerLogin(string email, string password);
        CustomerModel AddCustomer(string fullName, string address, string email, string password);
        bool DeleteCustomer(int id);
        CustomerModel GetCustomerById(int id);
        IEnumerable<CustomerModel> GetAllCustomers();
        CustomerModel EditCustomer(int id, string fullName, string address, string email, string password);
    }


    public class CustomerService : ICustomerService
    {
        private readonly IConfiguration _configuration;
        private readonly IEmailValidator _emailValidator;
        private readonly IPasswordHasher _passwordHasher;

        public CustomerService(IConfiguration configuration, IEmailValidator emailValidator, IPasswordHasher passwordHasher)
        {
            _configuration = configuration;
            _emailValidator = emailValidator;
            _passwordHasher = passwordHasher;
        }

        public CustomerModel CustomerLogin(string email, string password)
        {
            // Validate the email format first
            if (!_emailValidator.IsValid(email))
            {
                return null; // Invalid email format
            }

            // Check if customer exists
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Open();

            var sql = "SELECT id, full_name, address, email, password FROM Customer WHERE email = @Email LIMIT 1";
            var customer = connection.QueryFirstOrDefault<CustomerModel>(sql, new { Email = email });

            if (customer == null)
            {
                // No customer found with the provided email
                return null;
            }

            // Hash the provided password
            string hashedPassword = _passwordHasher.HashPassword(password);

            // Compare the hashed password with the stored hash
            if (customer.password == hashedPassword)
            {
                return customer; // Login successful, return the customer object
            }

            return null; // Password mismatch
        }

        public CustomerModel AddCustomer(string fullName, string address, string email, string password)
        {
            if (!_emailValidator.IsValid(email))
                throw new ArgumentException("Invalid email format.");

            if (!_emailValidator.AddEmailIsUnique(email))
                throw new ArgumentException("Email already exists.");

            string hashedPassword = _passwordHasher.HashPassword(password);

            var customer = new CustomerModel
            {
                full_name = fullName,
                address = address,
                email = email,
                password = hashedPassword
            };

            string sql = "INSERT INTO Customer (full_name, address, email, password) VALUES (@full_name, @address, @email, @password); SELECT LAST_INSERT_ID();";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            customer.id = connection.ExecuteScalar<int>(sql, customer);

            return customer;
        }

        public bool DeleteCustomer(int id)
        {
            string sql = "DELETE FROM Customer WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Execute(sql, new { Id = id }) > 0;
        }

        public CustomerModel GetCustomerById(int id)
        {
            string sql = "SELECT * FROM Customer WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.QuerySingleOrDefault<CustomerModel>(sql, new { Id = id });
        }

        public IEnumerable<CustomerModel> GetAllCustomers()
        {
            string sql = "SELECT * FROM Customer";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Query<CustomerModel>(sql).ToList();
        }

        public CustomerModel EditCustomer(int id, string fullName, string address, string email, string password)
        {
            if (!_emailValidator.IsValid(email))
                throw new ArgumentException("Invalid email format.");

            if (!_emailValidator.EditEmailIsUnique(email, id))
                throw new ArgumentException("Email already exists.");

            string hashedPassword = _passwordHasher.HashPassword(password);

            string sql = "UPDATE Customer SET full_name = @FullName, address = @Address, email = @Email, password = @Password WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Execute(sql, new { Id = id, FullName = fullName, Address = address, Email = email, Password = hashedPassword });

            return GetCustomerById(id);
        }
    }
}
