import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('UsuariosController (Capa de Controlador - Usuarios)', () => {
  let app: INestApplication;
  let service: UsuariosService;

  const mockUsuariosService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    service = moduleFixture.get<UsuariosService>(UsuariosService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /usuarios/:id debería retornar 404 si el usuario no existe', async () => {
    // Simular que el servicio lanza NotFoundException (para probar el status real)
    mockUsuariosService.findOne.mockImplementation(() => {
       throw new NotFoundException('Usuario no encontrado');
    });

    return request(app.getHttpServer())
      .get('/usuarios/999')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Usuario no encontrado');
      });
  });
});
