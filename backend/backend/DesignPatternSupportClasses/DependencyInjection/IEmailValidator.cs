using System.Text.RegularExpressions;

namespace backend.DesignPatternSupportClasses.DependencyInjection
{
    public interface IEmailValidator
    {
        bool IsValid(string email);
    }

    public class EmailValidator : IEmailValidator
    {
        public bool IsValid(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            // Regular expression pattern to validate email addresses
            string pattern = @"^[^@\s]+@[^@\s]+\.(com|ca)$";

            // Use Regex to validate email format
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }
    }

}
