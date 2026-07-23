using api.Application.DTOs.Book;
using api.Application.Mappings;
using api.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
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
            var booksDto = books.Select(b => b.ToBookDto());
            return Ok(booksDto);
        }



        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookDto bookDto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);
            var bookEntity = bookDto.ToBookFromCreateDto();
            await _bookRepo.CreateAsync(bookEntity);
            return Ok(bookEntity);
        }


    }
}
