import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(crearUsuarioDto: CrearUsuarioDto) {
    const existingUser = await this.findOneByEmail(crearUsuarioDto.email);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }
    const hashedPassword = await bcrypt.hash(crearUsuarioDto.password, 10);
    const user = this.usuariosRepository.create({
      ...crearUsuarioDto,
      password: hashedPassword,
    });
    return this.usuariosRepository.save(user);
  }

  findAll() {
    return this.usuariosRepository.find();
  }

  findOne(id: number) {
    return this.usuariosRepository.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.usuariosRepository.findOneBy({ email });
  }

  async update(id: number, actualizarUsuarioDto: ActualizarUsuarioDto) {
    const user = await this.findOne(id);
    if (!user) throw new ConflictException('Usuario no encontrado');

    if (actualizarUsuarioDto.password) {
      actualizarUsuarioDto.password = await bcrypt.hash(actualizarUsuarioDto.password, 10);
    }

    this.usuariosRepository.merge(user, actualizarUsuarioDto);
    return this.usuariosRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new ConflictException('Usuario no encontrado');
    await this.usuariosRepository.delete(id);
    return { deleted: true };
  }
}
