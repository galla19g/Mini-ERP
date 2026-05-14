import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Proveedor, { eager: true })
  proveedor: Proveedor;

  @ManyToOne(() => Producto, { eager: true })
  producto: Producto;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ nullable: true })
  numeroFactura: string;

  @CreateDateColumn()
  createdAt: Date;
}
