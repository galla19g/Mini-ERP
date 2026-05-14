import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../usuarios/enums/rol.enum';
import { ProductoTipo } from './enums/producto-tipo.enum';

@ApiTags('productos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PRODUCTOS)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  create(@Body() crearProductoDto: CrearProductoDto) {
    return this.productosService.create(crearProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  findAll(@Query('tipo') tipo?: ProductoTipo) {
    return this.productosService.findAll(tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PRODUCTOS)
  @ApiOperation({ summary: 'Actualizar un producto' })
  update(@Param('id') id: string, @Body() actualizarProductoDto: ActualizarProductoDto) {
    return this.productosService.update(+id, actualizarProductoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar un producto' })
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
