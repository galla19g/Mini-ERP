import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReportesService } from './reportes.service';
import { CreateReporteVentasDto } from './dto/create-reporte-ventas.dto';
import { CreateReporteComprasDto } from './dto/create-reporte-compras.dto';
import { CreateReporteInventarioDto } from './dto/create-reporte-inventario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../usuarios/enums/rol.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reportes')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('salud')
  @ApiOperation({
    summary: 'Verificar estado del microservicio de reportes',
  })
  async verificarSalud() {
    return await this.reportesService.verificarSalud();
  }

  @Post('ventas')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.VENDEDOR)
  @ApiOperation({
    summary: 'Generar reporte de ventas en PDF',
    description:
      'Genera un reporte detallado de ventas en PDF. Requiere rol admin, gerente o vendedor.',
  })
  async generarReporteVentas(
    @Body() dto: CreateReporteVentasDto,
    @Res() res: Response,
  ) {
    try {
      const pdf = await this.reportesService.generarReporteVentas(dto);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reporte_ventas_${Date.now()}.pdf`,
      );
      res.send(pdf);
    } catch (error) {
      throw error;
    }
  }

  @Post('compras')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.VENDEDOR)
  @ApiOperation({
    summary: 'Generar reporte de compras en PDF',
    description:
      'Genera un reporte detallado de compras en PDF. Requiere rol admin, gerente o comprador.',
  })
  async generarReporteCompras(
    @Body() dto: CreateReporteComprasDto,
    @Res() res: Response,
  ) {
    try {
      const pdf = await this.reportesService.generarReporteCompras(dto);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reporte_compras_${Date.now()}.pdf`,
      );
      res.send(pdf);
    } catch (error) {
      throw error;
    }
  }

  @Post('inventario')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.PRODUCTOS)
  @ApiOperation({
    summary: 'Generar reporte de inventario en PDF',
    description:
      'Genera un reporte del inventario actual en PDF. Requiere rol admin, gerente o almacenero.',
  })
  async generarReporteInventario(
    @Body() dto: CreateReporteInventarioDto,
    @Res() res: Response,
  ) {
    try {
      const pdf = await this.reportesService.generarReporteInventario(dto);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reporte_inventario_${Date.now()}.pdf`,
      );
      res.send(pdf);
    } catch (error) {
      throw error;
    }
  }
}
