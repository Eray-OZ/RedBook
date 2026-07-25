using api.Core.Enums;

namespace api.Application.DTOs.ReadingLog;

public class MarkLogDto
{
    public ReadingStatus Status { get; set; }
    public DateTime? FinishDate { get; set; }
    public int? ReadPages { get; set; }
    public float Rating { get; set; }
    public string? ReviewNotes { get; set; }

}

