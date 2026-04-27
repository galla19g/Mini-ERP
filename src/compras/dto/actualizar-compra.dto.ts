import { PartialType } from '@nestjs/swagger';
import { CrearCompraDto } from './crear-compra.dto';

export class ActualizarCompraDto extends PartialType(CrearCompraDto) {}
