import { Test, TestingModule } from '@nestjs/testing';
import { ComprasController } from './compras.controller';
import { ComprasService } from './compras.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('ComprasController (Capa de Controlador - Compras)', () => {
  let app: INestApplication;
  let service: ComprasService;

  const mockComprasService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ComprasController],
      providers: [
        {
          provide: ComprasService,
          useValue: mockComprasService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /compras debería retornar 201 Created cuando la compra es válida', async () => {
    const compraDto = {
      proveedorId: 1,
      items: [{ productoId: 1, cantidad: 10, precioUnitario: 500 }],
      total: 5000
    };
    
    mockComprasService.create.mockResolvedValue({ id: 1, ...compraDto });

    return request(app.getHttpServer())
      .post('/compras')
      .send(compraDto)
      .expect(201) // Verificación real de código HTTP
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.total).toBe(5000);
      });
  });
});
