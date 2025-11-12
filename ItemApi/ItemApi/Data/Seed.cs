using ItemApi.Models;

namespace ItemApi.Data
{
    public static class Seed
    {
        public static void Run(AppDbContext db)
        {
            if (db.Items.Any()) return;
            db.Items.AddRange(
                new Item { Name = "Ballpen", Code = "ITM-001", Brand = "Pilot", UnitPrice = 35 },
                new Item { Name = "Notebook", Code = "ITM-002", Brand = "Muji", UnitPrice = 120 },
                new Item { Name = "Stapler", Code = "ITM-003", Brand = "Deli", UnitPrice = 250 }
            );
            db.SaveChanges();
        }
    }
}
