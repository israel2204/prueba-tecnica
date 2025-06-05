using Microsoft.EntityFrameworkCore;
using prueba_tecnica.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace prueba_tecnica.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
