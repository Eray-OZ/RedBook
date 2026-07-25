using System.Text.Json.Serialization;
using api.Core.Entities.Common;
using api.Core.Enums;

namespace api.Core.Entities;

public class BookEntity : BaseEntity
{
    public required string Title { get; set; }
    public ItemType ItemType { get; set; }
    public int DefaultPageCount { get; set; }
    public DateTime PublishYear { get; set; }
    public string? GoogleBooksId { get; set; }
    public string? Isbn { get; set; }
    public string? CoverImageUrl { get; set; }
    public Guid AuthorId { get; set; }
    [JsonIgnore]
    public AuthorEntity? Author { get; set; }
    [JsonIgnore]
    public ICollection<ReadingLog>? ReadingLogs { get; set; } = new List<ReadingLog>();
}
