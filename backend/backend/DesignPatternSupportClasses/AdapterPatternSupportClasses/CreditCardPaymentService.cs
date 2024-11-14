namespace backend.Services
{
    public class CreditCardPaymentService : IPaymentService
    {
        public bool ProcessPayment(double amount, string creditCardNumber, string trackingNumber)
        {
            // Validate that credit card number has 16 characters
            return creditCardNumber.Length == 16;
        }
    }
}
