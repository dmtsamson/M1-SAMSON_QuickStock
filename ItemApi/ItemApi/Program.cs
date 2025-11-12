using ItemApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF InMemory
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseInMemoryDatabase("ItemDb"));

// CORS for Angular dev server
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ng", p => p
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("http://localhost:4200"));
});

var app = builder.Build();

// Seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    Seed.Run(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ng");
app.MapControllers();

app.Run();
