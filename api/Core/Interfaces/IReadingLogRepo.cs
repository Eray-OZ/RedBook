using api.Application.DTOs.ReadingLog;
using api.Core.Entities;

namespace api.Core.Interfaces;

public interface IReadingLogRepo
{
    Task<List<ReadingLog>> GetAllAsync();
    Task<ReadingLog> CreateAsync(ReadingLog logEntity);
    Task<ReadingLog?> MarkAsync(Guid id, MarkLogDto logDto);
}
