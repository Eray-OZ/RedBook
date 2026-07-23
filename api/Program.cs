using api.Application.Services;
using api.Core.Interfaces;
using api.Data.Context;
using api.Data.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddOpenApi();

builder.Services.AddControllers()
.AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => 
options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));



builder.Services.AddScoped<IBookRepo, BookRepo>();

builder.Services.AddHttpClient<GoogleBooksService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "My API v1");
});
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

