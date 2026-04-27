import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleVenta } from './detalle-venta.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Cliente, { eager: true })
  cliente: Cliente;

  @ManyToOne(() => Usuario, { eager: true })
  usuario: Usuario;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta, { cascade: true })
  detalles: DetalleVenta[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;
}
