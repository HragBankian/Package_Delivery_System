﻿using backend.DatabaseClasses;
using backend.DesignPatternSupportClasses.DependencyInjection;
using MySql.Data.MySqlClient;
using Dapper;

namespace backend.Services
{
    public interface ICustomerService
    {
        Customer CustomerLogin(string email, string password);
        Customer AddCustomer(string fullName, string address, string email, string password);
        bool DeleteCustomer(int id);
        Customer GetCustomerById(int id);
        IEnumerable<Customer> GetAllCustomers();
        Customer EditCustomer(int id, string fullName, string address, string email, string password);
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

        public Customer CustomerLogin(string email, string password)
        {
            // Validate the email format first
            if (!_emailValidator.IsValid(email))
            {
                return null; // Invalid email format
            }

            // Check if customer exists
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Open();

            var sql = "SELECT id, fullName, address, email, password FROM customer WHERE email = @Email LIMIT 1";
            var customer = connection.QueryFirstOrDefault<Customer>(sql, new { Email = email });

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

        public Customer AddCustomer(string fullName, string address, string email, string password)
        {
            if (!_emailValidator.IsValid(email))
                throw new ArgumentException("Invalid email format.");

            string hashedPassword = _passwordHasher.HashPassword(password);

            var customer = new Customer
            {
                fullName = fullName,
                address = address,
                email = email,
                password = hashedPassword
            };

            string sql = "INSERT INTO customer (fullName, address, email, password) VALUES (@FullName, @Address, @Email, @Password); SELECT LAST_INSERT_ID();";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            customer.id = connection.ExecuteScalar<int>(sql, customer);

            return customer;
        }

        public bool DeleteCustomer(int id)
        {
            string sql = "DELETE FROM customer WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Execute(sql, new { Id = id }) > 0;
        }

        public Customer GetCustomerById(int id)
        {
            string sql = "SELECT * FROM customer WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.QuerySingleOrDefault<Customer>(sql, new { Id = id });
        }

        public IEnumerable<Customer> GetAllCustomers()
        {
            string sql = "SELECT * FROM customer";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Query<Customer>(sql).ToList();
        }

        public Customer EditCustomer(int id, string fullName, string address, string email, string password)
        {
            if (!_emailValidator.IsValid(email))
                throw new ArgumentException("Invalid email format.");

            string hashedPassword = _passwordHasher.HashPassword(password);

            string sql = "UPDATE customer SET fullName = @FullName, address = @Address, email = @Email, password = @Password WHERE id = @Id";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Execute(sql, new { Id = id, FullName = fullName, Address = address, Email = email, Password = hashedPassword });

            return GetCustomerById(id);
        }
    }

}
