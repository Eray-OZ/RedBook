using api.Application.DTOs.ReadingLog;
using api.Application.DTOs.Statistic;
using api.Core.Entities;

namespace api.Core.Interfaces;

public interface IReadingLogRepo
{
    Task<List<ReadingLog>> GetAllAsync();
    Task<ReadingLog> CreateAsync(ReadingLog logEntity);
    Task<ReadingLog?> MarkAsync(Guid id, MarkLogDto logDto);
    Task<List<StatsByYearDto>> StatsByYear();
    Task<List<StatsTypeDto>> StatsType();
    Task<List<StatsStatusDto>> StatsStatus();
}
