namespace backend.DesignPatternSupportClasses.Observer
{
    public interface IObserver
    {
        void Update(string trackingStatus, string location);
    }

    public interface ISubject
    {
        void RegisterObserver(IObserver observer);
        void RemoveObserver(IObserver observer);
        void NotifyObservers(Guid trackingNumber);
    }
}

