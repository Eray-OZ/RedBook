using api.Core.Entities;
using api.Core.Enums;

namespace api.Application.DTOs.Book;

public class GetBookDto
{
    public required string Title { get; set; }
    public ItemType ItemType { get; set; }
    public int DefaultPageCount { get; set; }
    public DateTime PublishYear { get; set; }
    public required string AuthorName { get; set; }
}
