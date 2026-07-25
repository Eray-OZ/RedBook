using api.Application.DTOs.Author;
using api.Core.Entities;

namespace api.Application.Mappings;

public static class AuthorMap
{
    public static AuthorEntity ToAuthorFromCreateDto(this CreateAuthorDto authorDto)
    {
        return new AuthorEntity
        {
            Name = authorDto.Name,
            Bio = authorDto.Bio
        };
    }
}
