import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../usuarios/enums/rol.enum';

@ApiTags('clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.VENDEDOR)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  create(@Body() crearClienteDto: CrearClienteDto) {
    return this.clientesService.create(crearClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por id' })
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.VENDEDOR)
  @ApiOperation({ summary: 'Actualizar un cliente' })
  update(@Param('id') id: string, @Body() actualizarClienteDto: ActualizarClienteDto) {
    return this.clientesService.update(+id, actualizarClienteDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
