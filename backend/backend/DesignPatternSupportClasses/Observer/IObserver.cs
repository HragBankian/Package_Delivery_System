using backend.Models;

namespace backend.DesignPatternSupportClasses.Observer
{
    public interface IObserver
    {
        void Update(string message, TrackingModel tracking) { }
    }

    public interface ISubject
    {
        void NotifyObservers(Guid trackingNumber);
    }
}

