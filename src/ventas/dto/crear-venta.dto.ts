import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ItemVentaDto {
  @ApiProperty()
  @IsInt()
  productoId: number;

  @ApiProperty()
  @IsInt()
  cantidad: number;
}

export class CrearVentaDto {
  @ApiProperty()
  @IsInt()
  clienteId: number;

  @ApiProperty({ type: [ItemVentaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  items: ItemVentaDto[];
}
