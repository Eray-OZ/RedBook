using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using api.Application.DTOs.Author;
using api.Core.Entities;
using api.Core.Enums;

namespace api.Application.DTOs.Book;

public class CreateBookDto
{
    [Required]
    public required string Title { get; set; }
    [Required]
    public ItemType ItemType { get; set; }
    [Required]
    [Range(1,int.MaxValue, ErrorMessage ="Page Count must be bigger than 0!")]
    public int DefaultPageCount { get; set; }
    public DateTime PublishYear { get; set; }
    public string? GoogleBooksId { get; set; }
    public string? Isbn { get; set; }
    public string? CoverImageUrl { get; set; }
    public required CreateAuthorDto AuthorDto { get; set; }
}
