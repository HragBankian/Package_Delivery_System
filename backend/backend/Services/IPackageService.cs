using Dapper;
using MySql.Data.MySqlClient;
using backend.Models;

namespace backend.Services
{
    public interface IPackageService
    {
        bool CreatePackages(List<PackageModel> packages, int deliveryRequestId);
    }

    public class PackageService : IPackageService
    {
        private readonly IConfiguration _configuration;

        public PackageService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool CreatePackages(List<PackageModel> packages, int deliveryRequestId)
        {
            // SQL query to insert packages into the packages table
            string sql = @"
            INSERT INTO Package (length, width, height, weight, category, is_fragile, deliveryRequestId)
            VALUES (@length, @width, @height, @weight, @category, @is_fragile, @delivery_request_id);
        ";
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));

            // Use a transaction to ensure atomicity when inserting multiple packages
            connection.Open();
            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    foreach (var package in packages)
                    {
                        // Insert each package into the database
                        connection.Execute(sql, new
                        {
                            length = package.length,
                            width = package.width,
                            height = package.height,
                            weight = package.weight,
                            category = package.category.ToString(),  // Convert enum to string
                            is_fragile = package.is_fragile,
                            delivery_request_id = deliveryRequestId
                        }, transaction: transaction);
                    }

                    // Commit the transaction if all inserts succeed
                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    // Rollback transaction in case of any error
                    transaction.Rollback();
                    return false;
                }
            }
        }
    }
}
