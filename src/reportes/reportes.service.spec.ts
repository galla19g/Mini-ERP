import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ReportesService } from './reportes.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('ReportesService', () => {
  let service: ReportesService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportesService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ReportesService>(ReportesService);
    httpService = module.get<HttpService>(HttpService);
    
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('verificarSalud', () => {
    it('debería retornar datos de salud cuando el microservicio responde exitosamente', async () => {
      const mockResult = { status: 'healthy', servicio: 'Microservicio de Reportes' };
      const response: AxiosResponse = {
        data: mockResult,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.verificarSalud();

      expect(result).toEqual(mockResult);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/reportes/health'),
        expect.objectContaining({ timeout: 5000 }),
      );
    });

    it('debería lanzar HttpException con SERVICE_UNAVAILABLE si el microservicio falla o no está disponible', async () => {
      const error = new Error('Connection refused');
      (error as any).code = 'ECONNREFUSED';

      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.verificarSalud()).rejects.toThrow(HttpException);
      try {
        await service.verificarSalud();
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
        expect(e.getResponse()).toEqual(
          expect.objectContaining({
            error: 'Microservicio de reportes no disponible',
          }),
        );
      }
    });
  });

  describe('generarReporteVentas', () => {
    it('debería retornar el PDF Buffer cuando la llamada al microservicio es exitosa', async () => {
      const dto = {
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-06-15',
        ventas: [],
        total_general: 0,
        cantidad_registros: 0,
      };
      const mockPdfBuffer = Buffer.from('PDF_CONTENT');
      const response: AxiosResponse = {
        data: mockPdfBuffer,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.generarReporteVentas(dto);

      expect(result).toBe(mockPdfBuffer);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/reportes/ventas'),
        dto,
        expect.objectContaining({ responseType: 'arraybuffer', timeout: 120000 }),
      );
    });

    it('debería lanzar HttpException 503 si ocurre ECONNREFUSED', async () => {
      const dto = {
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-06-15',
        ventas: [],
        total_general: 0,
        cantidad_registros: 0,
      };
      const error = new Error('Connection refused');
      (error as any).code = 'ECONNREFUSED';

      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(service.generarReporteVentas(dto)).rejects.toThrow(HttpException);
      try {
        await service.generarReporteVentas(dto);
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      }
    });

    it('debería lanzar HttpException 504 si ocurre ECONNABORTED (timeout)', async () => {
      const dto = {
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-06-15',
        ventas: [],
        total_general: 0,
        cantidad_registros: 0,
      };
      const error = new Error('Timeout');
      (error as any).code = 'ECONNABORTED';

      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(service.generarReporteVentas(dto)).rejects.toThrow(HttpException);
      try {
        await service.generarReporteVentas(dto);
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.GATEWAY_TIMEOUT);
      }
    });

    it('debería lanzar HttpException 500 si el microservicio retorna error 500', async () => {
      const dto = {
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-06-15',
        ventas: [],
        total_general: 0,
        cantidad_registros: 0,
      };
      const error = {
        response: {
          status: 500,
          data: { detail: 'Internal MS Error' },
        },
        message: 'Request failed with status code 500',
      };

      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(service.generarReporteVentas(dto)).rejects.toThrow(HttpException);
      try {
        await service.generarReporteVentas(dto);
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('generarReporteCompras', () => {
    it('debería retornar el PDF Buffer cuando la llamada al microservicio es exitosa', async () => {
      const dto = {
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-06-15',
        compras: [],
        total_general: 0,
        cantidad_registros: 0,
      };
      const mockPdfBuffer = Buffer.from('PDF_CONTENT');
      const response: AxiosResponse = {
        data: mockPdfBuffer,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.generarReporteCompras(dto);

      expect(result).toBe(mockPdfBuffer);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/reportes/compras'),
        dto,
        expect.objectContaining({ responseType: 'arraybuffer', timeout: 120000 }),
      );
    });
  });

  describe('generarReporteInventario', () => {
    it('debería retornar el PDF Buffer cuando la llamada al microservicio es exitosa', async () => {
      const dto = {
        fecha_generacion: '2026-06-15T18:00:00Z',
        productos: [],
        valor_total_inventario: 0,
        empresa: 'Mini ERP',
      };
      const mockPdfBuffer = Buffer.from('PDF_CONTENT');
      const response: AxiosResponse = {
        data: mockPdfBuffer,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.generarReporteInventario(dto);

      expect(result).toBe(mockPdfBuffer);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/reportes/inventario'),
        dto,
        expect.objectContaining({ responseType: 'arraybuffer', timeout: 120000 }),
      );
    });
  });
});
