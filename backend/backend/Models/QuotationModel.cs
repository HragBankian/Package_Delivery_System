namespace backend.Models
{
    public class QuotationModel
    {
        public int id { get; set; }
        public double quote_amount { get; set; }
        public DateTime quote_date { get; set; }
        public int delivery_request_id { get; set; }
    }
}
