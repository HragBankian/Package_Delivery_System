namespace backend.DatabaseClasses;

public class DeliveryRequestModel
{
    // Delivery Request Details
    public int id { get; set; }
    public string pickupLocation { get; set; }
    public string dropoffLocation { get; set; }
    public DateTime requestDate { get; set; }
    public int customerId { get; set; }
    public OrderModel order { get; set; }
    public List<PackageModel> packages { get; set; }
}

