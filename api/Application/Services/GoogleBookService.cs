using System.Text.Json.Nodes;

namespace api.Application.Services;

public class GoogleBooksService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GoogleBooksService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["GoogleBooks:ApiKey"]
                ?? throw new ArgumentNullException("GoogleBooks:ApiKey", "API Not Found!");
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "RedBook/1.0");
    }

    public async Task<List<object>> SearchBookAsync(string query)
    {
        string url = $"https://www.googleapis.com/books/v1/volumes?q={Uri.EscapeDataString(query)}&key={_apiKey}&langRestrict=tr&printType=books&orderBy=relevance"; var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Google API Error: {response.StatusCode} - {errorContent}");
        }


        var jsonString = await response.Content.ReadAsStringAsync();
        var jsonNode = JsonNode.Parse(jsonString);
        var items = jsonNode?["items"]?.AsArray();

        var results = new List<object>();

        if (items != null)
        {
            foreach (var item in items)
            {
                // Döngünün içindeki CoverImageUrl atamasını şu şekilde değiştirin:
                string? rawCoverUrl = item["volumeInfo"]?["imageLinks"]?["thumbnail"]?.ToString();
                string? cleanCoverUrl = rawCoverUrl?.Replace("&edge=curl", "").Replace("zoom=1", "zoom=2");

                results.Add(new
                {
                    GoogleBooksId = item["id"]?.ToString(),
                    Title = item["volumeInfo"]?["title"]?.ToString() ?? "Bilinmiyor",
                    AuthorName = item["volumeInfo"]?["authors"]?[0]?.ToString() ?? "Bilinmeyen Yazar",
                    PageCount = (int?)item["volumeInfo"]?["pageCount"] ?? 0,
                    PublishYear = item["volumeInfo"]?["publishedDate"]?.ToString(),
                    CoverImageUrl = cleanCoverUrl
                });
            }
        }

        return results;
    }
}