using api.Application.DTOs.ReadingLog;
using api.Core.Entities;

namespace api.Application.Mappings;

public static class LogMapper
{

    public static GetLogDto ToLogDto(this ReadingLog log)
    {
        return new GetLogDto
        {
            Id = log.Id,
            BookName = log.Book.Title,
            ItemType = log.Book.ItemType,
            Status = log.Status,
            StartDate = log.StartDate,
            FinishDate = log.FinishDate,
            ReadPages = log.ReadPages,
            Rating = log.Rating,
            ReviewNotes = log.ReviewNotes,
            IsReRead = log.IsReRead,
            CoverImage = log.Book.CoverImageUrl
        };
    }

    public static ReadingLog ToLogFromCreateDto(this CreateLogDto logDto)
    {
        return new ReadingLog
        {
            Book = logDto.BookookDto.ToBookFromCreateDto(),
            Status = logDto.Status,
            StartDate = logDto.StartDate,
            IsReRead = logDto.IsReRead,
        };
    }

}
