namespace backend.DatabaseClasses;

public class OrderModel
{
    public int id { get; set; }              
    public OrderStatus status { get; set; }  
    public TrackingModel trackingObject { get; set; }   
}

public enum OrderStatus
{
    PaymentPending, //0: when the customer hasn't payed
    Shipped, //1: when the customer pays
    Delivered, //2: when the delivery is completed
}