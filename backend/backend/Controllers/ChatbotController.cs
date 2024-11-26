using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly ChatbotService _chatbotService;

    public ChatController(ChatbotService chatbotService)
    {
        _chatbotService = chatbotService;
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        try
        {
            var reply = await _chatbotService.GetChatbotResponseAsync(request.Message);
            return Ok(new { reply });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new { error = "Error communicating with OpenAI API", details = ex.Message });
        }
    }
}

public class ChatRequest
{
    public string Message { get; set; }
}