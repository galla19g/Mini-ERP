import { validate } from 'class-validator';
import { CrearClienteDto } from './crear-cliente.dto';

describe('CrearClienteDto (Capa de Modelo - Clientes)', () => {
  it('debería fallar la validación si el email no es válido', async () => {
    const dto = new CrearClienteDto();
    dto.nombre = 'Juan Perez';
    dto.identificacion = '12345678';
    dto.telefono = '3001234567';
    dto.email = 'email-invalido'; // Formato incorrecto

    const errors = await validate(dto);
    
    expect(errors.length).toBeGreaterThan(0);
    const emailError = errors.find(e => e.property === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.constraints).toHaveProperty('isEmail');
  });

  it('debería pasar la validación con un email correcto', async () => {
    const dto = new CrearClienteDto();
    dto.nombre = 'Juan Perez';
    dto.identificacion = '12345678';
    dto.telefono = '3001234567';
    dto.email = 'juan@ejemplo.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
