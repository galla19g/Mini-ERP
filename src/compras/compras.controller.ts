import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CrearCompraDto } from './dto/crear-compra.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../usuarios/enums/rol.enum';

@ApiTags('compras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ALMACENISTA)
  @ApiOperation({ summary: 'Registrar una nueva compra' })
  create(@Body() crearCompraDto: CrearCompraDto) {
    return this.comprasService.create(crearCompraDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las compras' })
  findAll() {
    return this.comprasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una compra por id' })
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ALMACENISTA)
  @ApiOperation({ summary: 'Actualizar una compra' })
  update(@Param('id') id: string, @Body() actualizarCompraDto: any) {
    return this.comprasService.update(+id, actualizarCompraDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar una compra' })
  remove(@Param('id') id: string) {
    return this.comprasService.remove(+id);
  }
}
