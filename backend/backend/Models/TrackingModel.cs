namespace backend.DatabaseClasses;

public class TrackingModel
{
    public int id { get; set; }
    public Guid trackingNumber { get; set; }
    public String currentLocation { get; set; }          
    public DateTime estimatedArrivalDate { get; set; }
}