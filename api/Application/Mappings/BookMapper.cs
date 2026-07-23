using api.Application.DTOs.Book;
using api.Core.Entities;

namespace api.Application.Mappings;

public static class BookMapper
{


    public static BookEntity ToBookFromCreateDto(this CreateBookDto bookDto)
    {
        return new BookEntity
        {
            Title= bookDto.Title,
            ItemType= bookDto.ItemType,
            DefaultPageCount = bookDto.DefaultPageCount,
            PublishYear = bookDto.PublishYear,
            GoogleBooksId = bookDto.GoogleBooksId,
            Isbn = bookDto.Isbn,
            CoverImageUrl = bookDto.CoverImageUrl,
            Author = bookDto.Author
        };
    }


    public static GetBookDto ToBookDto(this BookEntity bookEntity)
    {
        return new GetBookDto
        {
            Title = bookEntity.Title,
            ItemType = bookEntity.ItemType,
            DefaultPageCount = bookEntity.DefaultPageCount,
            PublishYear = bookEntity.PublishYear,
            AuthorName = bookEntity.Author!.Name
        };
    }

}
