import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearProveedorDto } from './dto/crear-proveedor.dto';
import { ActualizarProveedorDto } from './dto/actualizar-proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
  ) {}

  create(crearProveedorDto: CrearProveedorDto) {
    const proveedor = this.proveedoresRepository.create(crearProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  findAll() {
    return this.proveedoresRepository.find();
  }

  async findOne(id: number) {
    const proveedor = await this.proveedoresRepository.findOneBy({ id });
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return proveedor;
  }

  async update(id: number, actualizarProveedorDto: ActualizarProveedorDto) {
    const proveedor = await this.findOne(id);
    this.proveedoresRepository.merge(proveedor, actualizarProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async remove(id: number) {
    const proveedor = await this.findOne(id);
    await this.proveedoresRepository.remove(proveedor);
    return { deleted: true };
  }
}
