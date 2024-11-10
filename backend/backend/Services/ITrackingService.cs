using backend.DatabaseClasses;

public interface ITrackingService
{
    Tracking CreateTrackingForOrder();
}

public class TrackingService : ITrackingService
{
    public Tracking CreateTrackingForOrder()
    {
        // rewrite to interact with database, Greg
        //used in DeliveryFacade
        Tracking tracking = new Tracking
        {
        };

        return tracking;
    }
}