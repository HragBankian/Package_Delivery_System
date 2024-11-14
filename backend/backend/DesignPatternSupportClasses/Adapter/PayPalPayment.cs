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

        public bool ProcessPaymentType(double amount, string email)
        {
            // Validate email format
            return _emailValidator.IsValid(email);
        }
    }
}
