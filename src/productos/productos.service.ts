import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  create(crearProductoDto: CrearProductoDto) {
    const producto = this.productosRepository.create(crearProductoDto);
    return this.productosRepository.save(producto);
  }

  findAll() {
    return this.productosRepository.find();
  }

  async findOne(id: number) {
    const producto = await this.productosRepository.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async update(id: number, actualizarProductoDto: ActualizarProductoDto) {
    const producto = await this.findOne(id);
    this.productosRepository.merge(producto, actualizarProductoDto);
    return this.productosRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    await this.productosRepository.remove(producto);
    return { deleted: true };
  }

  async updateStock(id: number, cantidad: number) {
    const producto = await this.findOne(id);
    producto.stock += cantidad;
    return this.productosRepository.save(producto);
  }
}
