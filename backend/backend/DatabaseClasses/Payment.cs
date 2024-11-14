namespace backend.DatabaseClasses;

public class Payment
{
    public int Id { get; set; } // Primary key, auto-increment
    public double Amount { get; set; } // Payment amount
    public DateTime PaymentDate { get; set; } // Date of the payment
    public string PaymentMethod { get; set; } // Payment method (e.g., "CreditCard", "PayPal")
    public int QuotationId { get; set; } // Foreign key to link to Quotation
    public Quotation QuotationObject { get; set; } // Navigation property to the associated Quotation
}