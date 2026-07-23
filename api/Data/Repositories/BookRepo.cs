using api.Core.Entities;
using api.Core.Interfaces;
using api.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace api.Data.Repository;

public class BookRepo : IBookRepo
{


    private readonly AppDbContext _context;

    public BookRepo(AppDbContext context)
    {
        _context = context;
    }



    public async Task<List<BookEntity>> GetAllAsync()
    {
        return await _context.Books.ToListAsync();
    }
}
