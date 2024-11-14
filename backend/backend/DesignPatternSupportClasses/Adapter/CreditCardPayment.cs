namespace backend.Services
{
    public class CreditCardPayment : IPaymentService
    {
        public bool ProcessPaymentType(double amount, string creditCardNumber)
        {
            // Validate that credit card number has 16 characters
            return creditCardNumber.Length == 16;
        }
    }
}
