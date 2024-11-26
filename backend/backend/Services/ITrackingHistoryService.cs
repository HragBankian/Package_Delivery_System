using MySql.Data.MySqlClient;
using Dapper;

namespace backend.Services
{
    public interface ITrackingHistoryService
    {
        List<string> getTrackingHistoryByTrackingNumber(string trackingNumber);
    }

    public class TrackingHistoryService : ITrackingHistoryService
    {
        private readonly IConfiguration _configuration;

        public TrackingHistoryService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<string> getTrackingHistoryByTrackingNumber(string trackingNumber)
        {
            string sql = @"
                SELECT th.location
                FROM TrackingHistory th
                JOIN Tracking t ON th.tracking_id = t.id
                WHERE t.tracking_number = @trackingNumber
                ORDER BY th.id;";

            using var connection = new MySqlConnection(_configuration.GetConnectionString("MySqlDatabase"));
            return connection.Query<string>(sql, new { trackingNumber }).ToList();
        }
     }
}

