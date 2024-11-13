using backend.DatabaseClasses;

public interface ITrackingService
{
    Tracking CreateTracking();
}

public class TrackingService : ITrackingService
{
    public Tracking CreateTracking()
    {
        // rewrite to interact with database, Greg
        //used in DeliveryFacade
        Tracking tracking = new Tracking
        {
        };

        return tracking;
    }
}