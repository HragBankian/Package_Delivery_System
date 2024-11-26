using System.Data;
using backend.DesignPatternSupportClasses.DependencyInjection;
using backend.DesignPatternSupportClasses.Facade;
using backend.Services;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Utilities.Encoders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddScoped<IPaymentService, CreditCardPayment>();
builder.Services.AddScoped<IPaymentService, PayPalPayment>();
builder.Services.AddScoped<DeliveryFacade>();
builder.Services.AddScoped<PaymentFacade>();
builder.Services.AddScoped<IDeliveryRequestService, DeliveryRequestService>();
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddScoped<ITrackingService, TrackingService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IEmailValidator,  EmailValidator>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IQuotationService, QuotationService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddSingleton<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<ITrackingHistoryService, TrackingHistoryService>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(builder => builder
     .AllowAnyOrigin()
     .AllowAnyMethod()
     .AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.Run();
