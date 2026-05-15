import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ProductoTipo } from './enums/producto-tipo.enum';
import { Role } from '../usuarios/enums/rol.enum';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('ProductosController (Capa de Controladores)', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockProductosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Mocks para los guards para poder probar los endpoints sin autenticación real
  const mockJwtAuthGuard = { canActivate: jest.fn().mockReturnValue(true) };
  const mockRolesGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: mockProductosService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería retornar el producto creado (y código 201 por defecto de NestJS)', async () => {
      // Arrange
      const dto: CrearProductoDto = {
        nombre: 'Nuevo',
        precio: 100,
        stock: 50,
        categoria: 'Cat',
        tipo: ProductoTipo.TERMINADO,
      };
      const expectedResult = { id: 1, ...dto };
      mockProductosService.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(dto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('debería retornar un producto (código 200 OK)', async () => {
      // Arrange
      const id = '1';
      const expectedResult = { id: 1, nombre: 'Producto 1', stock: 10 };
      mockProductosService.findOne.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });
});
