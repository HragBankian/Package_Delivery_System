using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public interface IEmailService
    {
        void SendEmail(string to, string subject, string body);
    }

    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _senderEmail;
        private readonly string _senderPassword;

        public SmtpEmailService(IConfiguration configuration)
        {
            _configuration = configuration;

            // Retrieve SMTP configuration values from appsettings.json or environment variables
            _smtpServer = _configuration["Smtp:Server"];
            _smtpPort = int.Parse(_configuration["Smtp:Port"]);
            _senderEmail = _configuration["Smtp:SenderEmail"];
            _senderPassword = _configuration["Smtp:SenderPassword"];
        }

        public void SendEmail(string to, string subject, string body)
        {
            try
            {
                using var smtpClient = new SmtpClient(_smtpServer, _smtpPort)
                {
                    Credentials = new NetworkCredential(_senderEmail, _senderPassword),
                    EnableSsl = true
                };
                
                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(_senderEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true // Set to true if the email body is HTML
                };

                mailMessage.To.Add(to);
                
                smtpClient.Send(mailMessage);
                Console.WriteLine("Email sent successfully to " + to);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
                throw;
            }
        }
    }

}
