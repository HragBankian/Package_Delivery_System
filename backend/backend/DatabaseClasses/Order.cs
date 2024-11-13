namespace backend.DatabaseClasses;

public class Order
{
    public int id { get; set; }              
    public OrderStatus status { get; set; }  
    public Tracking trackingObject { get; set; }   
}

public enum OrderStatus
{
    PaymentPending, //when the customer hasn't payed yet ?
    Shipping, //change to this when customer pays ?
    Shipped, //change to this when idk?
}