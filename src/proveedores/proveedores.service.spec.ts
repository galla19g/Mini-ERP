import { Test, TestingModule } from '@nestjs/testing';
import { ProveedoresService } from './proveedores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProveedoresService (Capa de Servicio - Proveedores)', () => {
  let service: ProveedoresService;
  let repositoryMock: any;

  beforeEach(async () => {
    repositoryMock = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProveedoresService,
        {
          provide: getRepositoryToken(Proveedor),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProveedoresService>(ProveedoresService);
  });

  describe('findOne', () => {
    it('debería lanzar una NotFoundException si el proveedor no existe (Regla de negocio)', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow('Proveedor no encontrado');
    });

    it('debería retornar el proveedor si existe', async () => {
      const mockProveedor = { id: 1, nombre: 'Proveedor S.A.' };
      repositoryMock.findOneBy.mockResolvedValue(mockProveedor);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProveedor);
    });
  });
});
