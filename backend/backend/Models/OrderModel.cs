namespace backend.DatabaseClasses;

public class OrderModel
{
    public int id { get; set; }              
    public OrderStatus status { get; set; }  
    public TrackingModel trackingObject { get; set; }   
}

public enum OrderStatus
{
    PaymentPending, //when the customer hasn't payed yet ?
    Shipping, //change to this when customer pays ?
    Shipped, //change to this when idk?
}