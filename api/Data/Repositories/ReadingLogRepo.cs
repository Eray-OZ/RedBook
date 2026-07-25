using api.Application.DTOs.ReadingLog;
using api.Application.DTOs.Statistic;
using api.Core.Entities;
using api.Core.Enums;
using api.Core.Interfaces;
using api.Data.Context;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace api.Data.Repository;

public class ReadingLogRepo : IReadingLogRepo
{

    private readonly AppDbContext _context;

    public ReadingLogRepo(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReadingLog>> GetAllAsync()
    {
        return await _context.ReadingLogs.Include(r => r.Book).ThenInclude(b => b.Author).ToListAsync();
    }

    public async Task<ReadingLog> CreateAsync(ReadingLog logEntity)
    {   
        await _context.ReadingLogs.AddAsync(logEntity);
        await _context.SaveChangesAsync();
        return logEntity;
    }


    public async Task<ReadingLog?> MarkAsync(Guid id, MarkLogDto logDto)
    {   
        var logEntity = await _context.ReadingLogs.FirstOrDefaultAsync(x => x.Id == id);
        if (logEntity == null) { return null; }

        logEntity.Status = logDto.Status;
        logEntity.FinishDate = logDto.FinishDate;
        logEntity.ReadPages = logDto.ReadPages;
        logEntity.Rating = logDto.Rating;
        logEntity.ReviewNotes = logDto.ReviewNotes;
        await _context.SaveChangesAsync();

        return logEntity;    
    }


    public async Task<List<StatsByYearDto>> StatsByYear()
    {
        return await _context.ReadingLogs
                        .Where(r => r.FinishDate.HasValue && r.Status == ReadingStatus.Finished)
                        .GroupBy(r => r.FinishDate.Value.Year)
                        .Select(g => new StatsByYearDto
                        {
                            Year = g.Key,
                            ReadPages = g.Sum(x => x.ReadPages.Value),
                            ReadBooks = g.Count()
                        })
                        .ToListAsync();
    }



    public async Task<List<StatsTypeDto>> StatsType()
    {
        return await _context.ReadingLogs
                    .Include(r => r.Book)
                    .GroupBy(r => r.Book.ItemType)
                    .Select(g => new StatsTypeDto
                    {
                        ItemType = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();
    }
  
}
