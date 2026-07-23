using api.Core.Entities;

namespace api.Core.Interfaces;

public interface IBookRepo
{
    Task<List<BookEntity>> GetAllAsync();
}
