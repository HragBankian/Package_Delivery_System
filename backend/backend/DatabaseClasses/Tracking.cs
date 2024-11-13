namespace backend.DatabaseClasses;

public class Tracking
{
    public int id { get; set; }
    public Guid trackingNumber { get; set; }
    public String currentLocation { get; set; }          
    public DateTime estimatedArrivalDate { get; set; }   // Date the quote was created
}