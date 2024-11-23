using backend.DesignPatternSupportClasses.DependencyInjection;
using MySql.Data.MySqlClient;
using Dapper;
using backend.Models;

namespace backend.Services
{
    public interface IReviewService
    {
      ReviewModel? SubmitReview(int customerId, int rating, string comment);
      IEnumerable<ReviewModel>? GetAllReviews();
      IEnumerable<ReviewModel>? GetCustomerReviews(int customerId);
      ReviewModel? GetReviewById(int id);
      ReviewModel? DeleteReview(int id);
      
    }


    public class ReviewService : IReviewService
    {
        private readonly IConfiguration _configuration;

        public ReviewService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ReviewModel? SubmitReview(int customerId, int rating, string comment)
        {
            if (rating < 1 || rating > 5)
            {
                return null; 
            }
            
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Open();

            var sql = @"
                        INSERT INTO Review (customer_id, rating, comment)
                        VALUES (@CustomerId, @Rating, @Comment);

                        SELECT id, customer_id, rating, comment, date
                        FROM Review
                        WHERE id = LAST_INSERT_ID();
                        ";

            var review = connection.QueryFirstOrDefault<ReviewModel>(sql, new { CustomerId = customerId, Rating = rating, Comment = comment });
            return review;
        }
        
        public IEnumerable<ReviewModel> GetAllReviews()
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Open();

            var sql = "SELECT id, customer_id, rating, comment, date FROM Review";

            return connection.Query<ReviewModel>(sql);
        }

        public IEnumerable<ReviewModel> GetCustomerReviews(int customerId)
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Open();

            var sql = "SELECT id, customer_id, rating, comment, date FROM Review WHERE customer_id = @CustomerId";

            return connection.Query<ReviewModel>(sql, new { CustomerId = customerId });
        }

        public ReviewModel? GetReviewById(int id)
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Open();

            var sql = "SELECT id, customer_id, rating, comment, date FROM Review WHERE id = @Id";

            return connection.QuerySingleOrDefault<ReviewModel>(sql, new { Id = id });
        }
        public ReviewModel? DeleteReview(int id)
        {
            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            connection.Open();

            var selectSql = "SELECT id, customer_id, rating, comment, date FROM Review WHERE id = @Id";
    
            var review = connection.QuerySingleOrDefault<ReviewModel>(selectSql, new { Id = id });

            if (review == null)
            {
                return null;
            }

            var deleteSql = "DELETE FROM Review WHERE id = @Id";

            connection.Execute(deleteSql, new { Id = id });

            return review;
        }


        
    }
}
