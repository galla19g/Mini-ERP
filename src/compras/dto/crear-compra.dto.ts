import { IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearCompraDto {
  @ApiProperty()
  @IsInt()
  proveedorId: number;

  @ApiProperty()
  @IsInt()
  productoId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precioUnitario: number;
}
