import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductoTipo } from './enums/producto-tipo.enum';

const mockProductosRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductosService (Capa de Servicios)', () => {
  let service: ProductosService;
  let repository: MockRepository<Producto>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useFactory: mockProductosRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repository = module.get<MockRepository<Producto>>(getRepositoryToken(Producto));
  });

  describe('findOne', () => {
    it('debería lanzar NotFoundException si el producto no existe', async () => {
      // Arrange
      const id = 999;
      repository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('debería retornar el producto si existe', async () => {
      // Arrange
      const id = 1;
      const expectedProducto = { id, nombre: 'Test', stock: 10 };
      repository.findOneBy.mockResolvedValue(expectedProducto);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toEqual(expectedProducto);
    });
  });

  describe('updateStock', () => {
    it('debería actualizar el inventario correctamente', async () => {
      // Arrange
      const id = 1;
      const cantidadAAgregar = 5;
      const productoExistente = { id, nombre: 'Test', stock: 10 };
      
      // Simular que findOneBy encuentra el producto
      repository.findOneBy.mockResolvedValue(productoExistente);
      
      // Simular save devolviendo el producto actualizado
      repository.save.mockImplementation(async (prod) => prod);

      // Act
      const result = await service.updateStock(id, cantidadAAgregar);

      // Assert
      expect(result.stock).toBe(15);
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
