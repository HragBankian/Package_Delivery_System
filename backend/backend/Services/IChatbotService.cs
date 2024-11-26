using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class ChatbotService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _openAiApiKey;

    public ChatbotService(IHttpClientFactory httpClientFactory, string openAiApiKey)
    {
        _httpClientFactory = httpClientFactory;
        _openAiApiKey = openAiApiKey;
    }

    public async Task<string> GetChatbotResponseAsync(string userMessage)
    {
        string systemMessage = "You are a chatbot for the Omnivox2 website. Do not answer any questions not related to this website." +
                               "You are supposed to help customers of this website only with issues related to its services." +
                               "The services of this website include delivery order creation, tracking, and reviews." +
                               "If a user inputs any tracking number, redirect them to /tracking/[their number]" +
                               "If a user wants to track their order but doesnt provide the tracking number, redirect them to /tracking" +
                               "If a user wants to create a new order redirect them to /order/locations" +
                               "If a user wants to pursue to payment, redirect them to /order/continue" +
                               "There is also a login page at /login and a signup page at /signup" +
                               "Users can also leave reviews and see them at /reviews. Invite them often to go leave one or take a look." +
                               "We accept credit cards and PayPal only." +
                               "Create actual md links for the pages that users can click on.";

        var payload = new
        {
            model = "gpt-3.5-turbo",
            messages = new[]
            {
                new { role = "system", content = systemMessage },
                new { role = "user", content = userMessage  }
            },
            max_tokens = 200,
            temperature = 0.7
        };

        var httpClient = _httpClientFactory.CreateClient();
        httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _openAiApiKey);

        var response = await httpClient.PostAsync(
            "https://api.openai.com/v1/chat/completions",
            new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        );

        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Error from OpenAI API: {response.StatusCode} - {responseContent}");
        }

        var chatResponse = JsonSerializer.Deserialize<OpenAiResponse>(
            responseContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        if (chatResponse?.Choices == null || chatResponse.Choices.Length == 0)
        {
            throw new HttpRequestException("Invalid response from OpenAI API: " + responseContent);
        }

        return chatResponse.Choices[0].Message.Content;
    }
}