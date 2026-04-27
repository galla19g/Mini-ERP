import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  create(crearClienteDto: CrearClienteDto) {
    const cliente = this.clientesRepository.create(crearClienteDto);
    return this.clientesRepository.save(cliente);
  }

  findAll() {
    return this.clientesRepository.find();
  }

  async findOne(id: number) {
    const cliente = await this.clientesRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async update(id: number, actualizarClienteDto: ActualizarClienteDto) {
    const cliente = await this.findOne(id);
    this.clientesRepository.merge(cliente, actualizarClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clientesRepository.remove(cliente);
    return { deleted: true };
  }
}
