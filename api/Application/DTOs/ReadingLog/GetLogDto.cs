using api.Core.Entities;
using api.Core.Enums;

namespace api.Application.DTOs.ReadingLog;

public class GetLogDto
{
    public required string BookName { get; set; }
    public ItemType ItemType { get; set;}
    public ReadingStatus Status { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? FinishDate { get; set; }
    public int? ReadPages { get; set; }
    public float Rating { get; set; }
    public string? ReviewNotes { get; set; }
    public bool IsReRead { get; set; }
}
