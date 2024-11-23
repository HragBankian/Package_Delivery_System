using backend.Models;

namespace backend.Controllers
{
    using global::backend.Services;
    using Microsoft.AspNetCore.Mvc;

    namespace backend.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class ReviewController : ControllerBase
        {
            private readonly IReviewService _reviewService;

            public ReviewController(IReviewService reviewService)
            {
                _reviewService = reviewService;
            }

            [HttpPost("create/{customerId}")]
            public IActionResult SubmitReview(int customerId, int rating, string comment)
            {
                ReviewModel? review = _reviewService.SubmitReview(customerId, rating, comment);
                if (review == null || rating > 5 || rating < 0)
                {
                    return BadRequest();
                }
                return Ok(review);
            }

            [HttpGet("getAllReviews")]
            public IActionResult GetAllReviews()
            {
                var reviews = _reviewService.GetAllReviews();
                if (reviews == null)
                {
                    return BadRequest();
                }
                return Ok(reviews);
            }
            [HttpGet("getCustomerReviews/{customerId}")]
            public IActionResult GetCustomerReviews(int customerId)
            {
                var reviews = _reviewService.GetCustomerReviews(customerId);
                if (reviews == null)
                {
                    return BadRequest();
                }
                return Ok(reviews);
            }
            [HttpGet("getReviewById/{id}")]
            public IActionResult GetReviewById(int id)
            {
                {
                    var review = _reviewService.GetReviewById(id);
                    if (review == null)
                    {
                        return BadRequest();
                    }
                    return Ok(review);
                }
            }
            [HttpDelete("deleteReview/{id}")]
            public IActionResult DeleteReview(int id)
            {
                {
                    var review = _reviewService.DeleteReview(id);
                    if (review == null)
                    {
                        return BadRequest();
                    }
                    return Ok(review);
                }
            }
            
        }
    }

}
