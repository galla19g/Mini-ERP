import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CrearVentaDto } from './dto/crear-venta.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../usuarios/enums/rol.enum';

@ApiTags('ventas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @Roles(Role.ADMIN, Role.VENDEDOR)
  @ApiOperation({ summary: 'Registrar una nueva venta' })
  create(@Body() crearVentaDto: CrearVentaDto, @Request() req) {
    return this.ventasService.create(crearVentaDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por id' })
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }
}
