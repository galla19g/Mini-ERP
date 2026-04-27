import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta]),
    ProductosModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
