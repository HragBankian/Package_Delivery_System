namespace backend.Services
{
    public interface IPaymentService
    {
        bool ProcessPayment(double amount, string paymentMethod, string trackingNumber);
    }

    public class PaymentService : IPaymentService
    {
        private readonly CreditCardPayment _creditCardService;
        private readonly PayPalPayment _payPalService;

        public PaymentService(CreditCardPayment creditCardService, PayPalPayment payPalService)
        {
            _creditCardService = creditCardService;
            _payPalService = payPalService;
        }

        public bool ProcessPayment(double amount, string paymentMethod, string trackingNumber)
        {
            if (paymentMethod == "CreditCard")
            {
                return _creditCardService.ProcessPayment(amount, trackingNumber, trackingNumber);
            }
            else if (paymentMethod == "PayPal")
            {
                return _payPalService.ProcessPayment(amount, trackingNumber, trackingNumber);
            }
            else
            {
                throw new ArgumentException("Invalid payment method.");
            }
        }
    }
}

