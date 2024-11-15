namespace backend.Models
{
    public class TrackingModel
    {
        public int id { get; set; }
        public Guid tracking_number { get; set; }
        public String current_location { get; set; }          
        public DateTime estimated_arrival_date { get; set; }
        public int delivery_request_id { get; set; }
    }
}