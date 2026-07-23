using api.Core.Entities;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;

namespace api.Data.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}


    public DbSet<AuthorEntity> Authors { get; set; }
    public DbSet<BookEntity> Books { get; set; }
    public DbSet<ReadingLog> ReadingLogs { get; set; }
   
}
