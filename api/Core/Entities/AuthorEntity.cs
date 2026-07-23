using api.Core.Entities.Common;

namespace api.Core.Entities;

public class AuthorEntity : BaseEntity
{
    public required string Name { get; set; }
    public string? Bio { get; set; }
    public ICollection<BookEntity> Books { get; set; } = new List<BookEntity>();
}
