namespace backend.DatabaseClasses;

public class DeliveryRequest
{
    // Delivery Request Details
    public int id { get; set; }
    public string pickupLocation { get; set; }
    public string dropoffLocation { get; set; }
    public DateTime requestDate { get; set; }
    public int customerId { get; set; }
    public Order order { get; set; }
    public List<Package> packages { get; set; }
}

