import { validate } from 'class-validator';
import { CrearProductoDto } from './crear-producto.dto';
import { ProductoTipo } from '../enums/producto-tipo.enum';

describe('CrearProductoDto (Capa de Modelo)', () => {
  it('Debería fallar la validación cuando el precio es negativo', async () => {
    // Arrange
    const dto = new CrearProductoDto();
    dto.nombre = 'Producto de Prueba';
    dto.precio = -10; // Valor inválido
    dto.stock = 5;
    dto.categoria = 'Categoría Prueba';
    dto.tipo = ProductoTipo.TERMINADO;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    const precioError = errors.find((e) => e.property === 'precio');
    expect(precioError).toBeDefined();
    expect(precioError.constraints).toHaveProperty('min');
  });

  it('Debería pasar la validación con datos correctos', async () => {
    // Arrange
    const dto = new CrearProductoDto();
    dto.nombre = 'Producto Válido';
    dto.precio = 100;
    dto.stock = 10;
    dto.categoria = 'Bebidas';
    dto.tipo = ProductoTipo.MATERIA_PRIMA;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
