using api.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ap.Controllers
{
    [Route("api/book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookRepo _bookRepo;
        public BookController(IBookRepo bookRepo)
        {
            _bookRepo = bookRepo;
        }



        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var books = await _bookRepo.GetAllAsync();
            return Ok(books);
        }



    }
}
