using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System.IO;
using prueba_tecnica.Data;
using prueba_tecnica.Models;

namespace prueba_tecnica.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Products.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            if (product.Id != 0)
            {
                return BadRequest(new { error = "No se debe enviar el campo 'Id' al crear un producto." });
            }

            product.Id = 0;

            _context.Products.Add(product);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { error = "Error al guardar el producto.", detalle = ex.InnerException?.Message ?? ex.Message });
            }
            return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product product)
        {
            if (id != product.Id) return BadRequest();
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("reporte-pdf")]
        public async Task<IActionResult> GetPdfReport()
        {
            try
            {
                var products = await _context.Products.ToListAsync();

                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Margin(30);
                        page.Header().Text("Reporte de Productos").FontSize(20).Bold();
                        page.Content().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(40);
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.ConstantColumn(80);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Element(c => CellStyle(c)).Text("ID");
                                header.Cell().Element(c => CellStyle(c)).Text("Nombre");
                                header.Cell().Element(c => CellStyle(c)).Text("Descripción");
                                header.Cell().Element(c => CellStyle(c)).Text("Precio");
                            });

                            foreach (var p in products)
                            {
                                table.Cell().Element(c => CellStyle(c)).Text(p.Id.ToString());
                                table.Cell().Element(c => CellStyle(c)).Text(p.Nombre ?? "");
                                table.Cell().Element(c => CellStyle(c)).Text(p.Descripcion ?? "");
                                table.Cell().Element(c => CellStyle(c)).Text($"{p.Precio:C}");
                            }
                        });
                    });
                });

                using var pdfStream = new MemoryStream();
                document.GeneratePdf(pdfStream);
                pdfStream.Position = 0;

                return File(pdfStream.ToArray(), "application/pdf", "reporte_productos.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error al generar el PDF", detalle = ex.Message });
            }
        }

        private static IContainer CellStyle(IContainer container)
        {
            return container.PaddingVertical(5).PaddingHorizontal(2);
        }
    }
}
