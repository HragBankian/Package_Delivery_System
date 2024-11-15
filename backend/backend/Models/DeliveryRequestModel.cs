using backend.Enumerations;

namespace backend.Models
{
    public class DeliveryRequestModel
    {
        public int id { get; set; }
        public string pickup_location { get; set; }
        public string dropoff_location { get; set; }
        public DateTime request_date { get; set; }
        public OrderStatus status { get; set; }
        public int customer_id { get; set; }
        public List<PackageModel> packages { get; set; }
    }
}
