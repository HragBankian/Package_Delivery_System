using System.Data;
using Dapper;
using backend.DatabaseClasses;

namespace backend.Services;

public interface IPackageService
{
    bool CreatePackages(List<Package> packages, int deliveryRequestId);
}

public class PackageService : IPackageService
{
    private readonly IDbConnection _dbConnection;

    public PackageService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public bool CreatePackages(List<Package> packages, int deliveryRequestId)
    {
        // SQL query to insert packages into the packages table
        string sql = @"
            INSERT INTO packages (length, width, height, weight, category, isFragile, deliveryRequestId)
            VALUES (@Length, @Width, @Height, @Weight, @Category, @IsFragile, @DeliveryRequestId);
        ";

        // Use a transaction to ensure atomicity when inserting multiple packages
        using (var transaction = _dbConnection.BeginTransaction())
        {
            try
            {
                foreach (var package in packages)
                {
                    // Insert each package into the database
                    _dbConnection.Execute(sql, new
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
