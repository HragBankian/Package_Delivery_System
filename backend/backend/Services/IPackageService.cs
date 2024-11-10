using System.Data;
using Dapper;
using backend.DatabaseClasses;
using MySql.Data.MySqlClient;

namespace backend.Services;

public interface IPackageService
{
    bool CreatePackages(List<Package> packages, int deliveryRequestId);
}

public class PackageService : IPackageService
{
    private readonly IConfiguration _configuration;

    public PackageService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public bool CreatePackages(List<Package> packages, int deliveryRequestId)
    {
        // SQL query to insert packages into the packages table
        string sql = @"
            INSERT INTO packages (length, width, height, weight, category, isFragile, deliveryRequestId)
            VALUES (@Length, @Width, @Height, @Weight, @Category, @IsFragile, @DeliveryRequestId);
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
                        Length = package.length,
                        Width = package.width,
                        Height = package.height,
                        Weight = package.weight,
                        Category = package.category.ToString(),  // Convert enum to string
                        IsFragile = package.isFragile,
                        DeliveryRequestId = deliveryRequestId
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
