using System.ComponentModel.DataAnnotations;
using api.Core.Entities;
using api.Core.Enums;

namespace api.Application.DTOs.Book;

public class CreateBookDto
{
    [Required]
    public required string Title { get; set; }
    public ItemType ItemType { get; set; }
    public int DefaultPageCount { get; set; }
    public DateTime PublishYear { get; set; }
    public string? GoogleBooksId { get; set; }
    public string? Isbn { get; set; }
    public string? CoverImageUrl { get; set; }
    public Guid AuthorId { get; set; }
}
