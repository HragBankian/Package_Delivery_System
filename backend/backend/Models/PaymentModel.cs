using backend.Enumerations;

namespace backend.Models
{
    public class PaymentModel
    {
        public int id { get; set; }
        public DateTime payment_date { get; set; }
        public PaymentMethod payment_method { get; set; }
        public int quotation_id { get; set; }
    }
}