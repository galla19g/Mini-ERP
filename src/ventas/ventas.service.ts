import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CrearVentaDto } from './dto/crear-venta.dto';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    private productosService: ProductosService,
    private dataSource: DataSource,
  ) {}

  async create(crearVentaDto: CrearVentaDto, usuarioId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;
      const detalles: DetalleVenta[] = [];

      for (const item of crearVentaDto.items) {
        const producto = await this.productosService.findOne(item.productoId);
        
        if (producto.stock < item.cantidad) {
          throw new BadRequestException(`No hay suficiente stock para el producto ${producto.nombre}`);
        }

        const detalle = new DetalleVenta();
        detalle.producto = producto;
        detalle.cantidad = item.cantidad;
        detalle.precioUnitario = producto.precio;
        detalles.push(detalle);

        total += detalle.cantidad * detalle.precioUnitario;

        // Update stock
        await this.productosService.updateStock(producto.id, -item.cantidad);
      }

      const venta = this.ventasRepository.create({
        cliente: { id: crearVentaDto.clienteId } as any,
        usuario: { id: usuarioId } as any,
        detalles,
        total,
      });

      const savedVenta = await queryRunner.manager.save(venta);
      await queryRunner.commitTransaction();
      return savedVenta;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.ventasRepository.find({ relations: ['detalles', 'cliente', 'usuario'] });
  }

  findOne(id: number) {
    return this.ventasRepository.findOne({
      where: { id },
      relations: ['detalles', 'cliente', 'usuario'],
    });
  }
}
