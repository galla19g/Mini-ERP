import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../enums/rol.enum';
import { Exclude } from 'class-transformer';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  activo: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.VENDEDOR,
  })
  rol: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
