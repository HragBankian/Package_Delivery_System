namespace backend.DatabaseClasses;

public class Quotation
{
    //i think generating a quotation's amount should have to do with the packages of a DeliveryRequest.
    //ex given deliveryRequestId, go find all packages associated to that delivery request, and calculate based on that
    public int id { get; set; }            
    public decimal quoteAmount { get; set; }  
    public DateTime quoteDate { get; set; }   
    public DeliveryRequest associatedDelivery { get; set; }
}