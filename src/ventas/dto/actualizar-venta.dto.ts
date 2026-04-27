import { PartialType } from '@nestjs/swagger';
import { CrearVentaDto } from './crear-venta.dto';

export class ActualizarVentaDto extends PartialType(CrearVentaDto) {}
