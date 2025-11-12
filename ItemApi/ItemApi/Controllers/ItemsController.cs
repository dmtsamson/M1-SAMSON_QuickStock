using ItemApi.Data;
using ItemApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ItemApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ItemsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetAll()
            => Ok(await _db.Items.AsNoTracking().ToListAsync());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Item>> GetById(int id)
        {
            var item = await _db.Items.FindAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Item>> Create(Item item)
        {
            _db.Items.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Item input)
        {
            if (id != input.Id) return BadRequest();
            var exists = await _db.Items.AnyAsync(x => x.Id == id);
            if (!exists) return NotFound();
            _db.Entry(input).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Items.FindAsync(id);
            if (item is null) return NotFound();
            _db.Items.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
