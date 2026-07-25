using api.Application.DTOs.Book;
using api.Core.Entities;
using api.Core.Enums;

namespace api.Application.DTOs.ReadingLog;

public class CreateLogDto
{
    public required CreateBookDto BookookDto { get; set; }
    public ReadingStatus Status { get; set; }
    public DateTime? StartDate { get; set; }
    public bool IsReRead { get; set; }

}
