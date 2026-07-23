using api.Application.DTOs.Book;
using api.Application.Mappings;
using api.Application.Services;
using api.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;

namespace api.Controllers
{
    [Route("api/book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookRepo _bookRepo;
        private readonly GoogleBooksService _googleBookService;
        public BookController(IBookRepo bookRepo, GoogleBooksService googleBooksService)
        {
            _bookRepo = bookRepo;
            _googleBookService = googleBooksService;
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


        [HttpGet("search-google-books")]
        public async Task<IActionResult> SearchFromGoogleBooks([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query)) 
            return BadRequest("Cannot be null");

            var results = await _googleBookService.SearchBookAsync(query);
            return Ok(results);
        }



    }
}
