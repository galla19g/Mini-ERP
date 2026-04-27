import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CrearCompraDto } from './dto/crear-compra.dto';
import { Compra } from './entities/compra.entity';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private comprasRepository: Repository<Compra>,
    private productosService: ProductosService,
    private dataSource: DataSource,
  ) {}

  async create(crearCompraDto: CrearCompraDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const compra = this.comprasRepository.create({
        proveedor: { id: crearCompraDto.proveedorId } as any,
        producto: { id: crearCompraDto.productoId } as any,
        cantidad: crearCompraDto.cantidad,
        precioUnitario: crearCompraDto.precioUnitario,
      });

      const savedCompra = await queryRunner.manager.save(compra);

      // Increment stock
      await this.productosService.updateStock(crearCompraDto.productoId, crearCompraDto.cantidad);

      await queryRunner.commitTransaction();
      return savedCompra;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.comprasRepository.find({ relations: ['proveedor', 'producto'] });
  }

  async findOne(id: number) {
    const compra = await this.comprasRepository.findOne({
      where: { id },
      relations: ['proveedor', 'producto'],
    });
    if (!compra) throw new NotFoundException('Compra no encontrada');
    return compra;
  }

  async update(id: number, actualizarCompraDto: any) {
    const compra = await this.findOne(id);
    this.comprasRepository.merge(compra, actualizarCompraDto);
    return this.comprasRepository.save(compra);
  }

  async remove(id: number) {
    const compra = await this.findOne(id);
    await this.comprasRepository.remove(compra);
    return { deleted: true };
  }
}
