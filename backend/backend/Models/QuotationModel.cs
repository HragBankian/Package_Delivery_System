﻿namespace backend.DatabaseClasses;

public class QuotationModel
{
    public int Id { get; set; }
    public double QuoteAmount { get; set; }
    public DateTime QuoteDate { get; set; }
    public int DeliveryRequestId { get; set; }
}