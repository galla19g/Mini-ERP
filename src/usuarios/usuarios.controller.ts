import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/rol.enum';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuariosService.create(crearUsuarioDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  update(@Param('id') id: string, @Body() actualizarUsuarioDto: ActualizarUsuarioDto) {
    return this.usuariosService.update(+id, actualizarUsuarioDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
