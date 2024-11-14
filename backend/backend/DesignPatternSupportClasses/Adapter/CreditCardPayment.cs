namespace backend.Services
{
    public class CreditCardPayment : IPaymentService
    {
        public bool ProcessPayment(double amount, string creditCardNumber, string trackingNumber)
        {
            // Validate that credit card number has 16 characters
            return creditCardNumber.Length == 16;
        }
    }
}
