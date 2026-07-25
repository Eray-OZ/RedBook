using api.Application.DTOs.ReadingLog;
using api.Core.Entities;
using api.Core.Interfaces;
using api.Data.Context;
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
}
