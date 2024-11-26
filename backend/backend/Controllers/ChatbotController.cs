using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public ChatController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
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
                new { role = "user", content = request.Message }
            },
            max_tokens = 200,
            temperature = 0.7
        };

        var httpClient = _httpClientFactory.CreateClient();

        try
        {
            var apiKey = "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"; // Replace with your OpenAI API key
            httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

            var response = await httpClient.PostAsync(
                "https://api.openai.com/v1/chat/completions",
                new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
            );

            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Raw OpenAI Response: " + responseContent); // Debugging

            var chatResponse = JsonSerializer.Deserialize<OpenAiResponse>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Ignore case sensitivity
                });


            return Ok(new { reply = chatResponse.Choices[0].Message.Content });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new { error = "Error communicating with OpenAI API", details = ex.Message });
        }
    }
}

// Chat request model
public class ChatRequest
{
    public string Message { get; set; }
}

// Models for deserializing OpenAI response
public class OpenAiResponse
{
    public string Id { get; set; }
    public string Object { get; set; }
    public long Created { get; set; }
    public string Model { get; set; }
    public Choice[] Choices { get; set; }
    public Usage Usage { get; set; }
}

public class Choice
{
    public int Index { get; set; }
    public ChatMessage Message { get; set; }
    public string FinishReason { get; set; }
    public object Logprobs { get; set; }
}

public class ChatMessage
{
    public string Role { get; set; }
    public string Content { get; set; }
    public object Refusal { get; set; }
}

public class Usage
{
    public int PromptTokens { get; set; }
    public int CompletionTokens { get; set; }
    public int TotalTokens { get; set; }
    public TokenDetails PromptTokensDetails { get; set; }
    public TokenDetails CompletionTokensDetails { get; set; }
}

public class TokenDetails
{
    public int CachedTokens { get; set; }
    public int AudioTokens { get; set; }
    public int ReasoningTokens { get; set; }
    public int AcceptedPredictionTokens { get; set; }
    public int RejectedPredictionTokens { get; set; }
}