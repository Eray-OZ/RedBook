namespace api.Application.DTOs.Author;

public class CreateAuthorDto
{
    public required string Name { get; set; }
    public string? Bio { get; set; }
}
