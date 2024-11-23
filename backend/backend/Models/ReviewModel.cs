namespace backend.Models
{
    public class ReviewModel
    {
        public int id { get; set; }
        public int customer_id { get; set; }
        public int rating { get; set; }
        public string comment { get; set; }
        public DateTime date { get; set; }
        
    }
}
