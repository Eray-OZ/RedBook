using api.Core.Entities.Common;
using api.Core.Enums;

namespace api.Core.Entities;

public class ReadingLog : BaseEntity
{
    public Guid BookId { get; set; }
    public required BookEntity Book { get; set; }
    public ReadingStatus Status { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? FinishDate { get; set; }
    public int ReadPages { get; set; }
    public float Rating { get; set; }
    public string? ReviewNotes { get; set; }
    public bool IsReRead { get; set; }
}
