import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalles_venta')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles)
  venta: Venta;

  @ManyToOne(() => Producto, { eager: true })
  producto: Producto;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;
}
