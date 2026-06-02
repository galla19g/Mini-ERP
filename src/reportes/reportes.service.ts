import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateReporteVentasDto } from './dto/create-reporte-ventas.dto';
import { CreateReporteComprasDto } from './dto/create-reporte-compras.dto';
import { CreateReporteInventarioDto } from './dto/create-reporte-inventario.dto';

@Injectable()
export class ReportesService {
  private readonly logger = new Logger(ReportesService.name);
  private readonly MICROSERVICIO_URL = process.env.MICROSERVICIO_REPORTES_URL || 'http://localhost:8001';
  private readonly TIMEOUT = 120000; // 120 segundos timeout

  constructor(private readonly httpService: HttpService) {}

  /**
   * Verifica la salud del microservicio
   */
  async verificarSalud(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.MICROSERVICIO_URL}/api/reportes/health`, {
          timeout: 5000,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Microservicio no disponible: ${error.message}`);
      throw new HttpException(
        {
          exito: false,
          error: 'Microservicio de reportes no disponible',
          detalles: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Genera reporte de ventas
   */
  async generarReporteVentas(dto: CreateReporteVentasDto): Promise<Buffer> {
    try {
      this.logger.log(
        `Generando reporte de ventas del ${dto.fecha_inicio} al ${dto.fecha_fin}`,
      );

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.MICROSERVICIO_URL}/api/reportes/ventas`,
          dto,
          {
            responseType: 'arraybuffer',
            timeout: this.TIMEOUT,
          },
        ),
      );

      this.logger.log('Reporte de ventas generado exitosamente');
      return response.data as Buffer;
    } catch (error) {
      this.logger.error(`Error al generar reporte de ventas: ${error.message}`);
      this.manejarErrorMicroservicio(error);
    }
  }

  /**
   * Genera reporte de compras
   */
  async generarReporteCompras(dto: CreateReporteComprasDto): Promise<Buffer> {
    try {
      this.logger.log(
        `Generando reporte de compras del ${dto.fecha_inicio} al ${dto.fecha_fin}`,
      );

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.MICROSERVICIO_URL}/api/reportes/compras`,
          dto,
          {
            responseType: 'arraybuffer',
            timeout: this.TIMEOUT,
          },
        ),
      );

      this.logger.log('Reporte de compras generado exitosamente');
      return response.data as Buffer;
    } catch (error) {
      this.logger.error(`Error al generar reporte de compras: ${error.message}`);
      this.manejarErrorMicroservicio(error);
    }
  }

  /**
   * Genera reporte de inventario
   */
  async generarReporteInventario(
    dto: CreateReporteInventarioDto,
  ): Promise<Buffer> {
    try {
      this.logger.log('Generando reporte de inventario');

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.MICROSERVICIO_URL}/api/reportes/inventario`,
          dto,
          {
            responseType: 'arraybuffer',
            timeout: this.TIMEOUT,
          },
        ),
      );

      this.logger.log('Reporte de inventario generado exitosamente');
      return response.data as Buffer;
    } catch (error) {
      this.logger.error(
        `Error al generar reporte de inventario: ${error.message}`,
      );
      this.manejarErrorMicroservicio(error);
    }
  }

  /**
   * Maneja errores del microservicio
   */
  private manejarErrorMicroservicio(error: any): void {
    if (error.response?.status === 500) {
      throw new HttpException(
        {
          exito: false,
          error: 'Error interno del microservicio de reportes',
          detalles: error.response?.data?.detail || 'Error desconocido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (error.code === 'ECONNREFUSED') {
      throw new HttpException(
        {
          exito: false,
          error: 'El microservicio de reportes no está disponible',
          detalles: `No se puede conectar a ${this.MICROSERVICIO_URL}`,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (error.code === 'ECONNABORTED') {
      throw new HttpException(
        {
          exito: false,
          error: 'Timeout al generar reporte',
          detalles:
            'El microservicio tardó demasiado en responder. Intente más tarde.',
        },
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    throw new HttpException(
      {
        exito: false,
        error: 'Error al comunicarse con el microservicio de reportes',
        detalles: error.message,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
