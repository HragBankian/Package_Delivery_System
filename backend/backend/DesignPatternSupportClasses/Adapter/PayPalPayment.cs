using backend.DesignPatternSupportClasses.DependencyInjection;

namespace backend.Services
{
    public class PayPalPayment : IPaymentService
    {
        private readonly IEmailValidator _emailValidator;

        public PayPalPayment(IEmailValidator emailValidator)
        {
            _emailValidator = emailValidator;
        }

        public bool ProcessPayment(double amount, string email, string trackingNumber)
        {
            // Validate email format
            return _emailValidator.IsValid(email);
        }
    }
}
