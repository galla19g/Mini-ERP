import { IsNotEmpty, IsNumber, IsString, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductoTipo } from '../enums/producto-tipo.enum';

export class CrearProductoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoria: string;

  @ApiProperty({ enum: ProductoTipo })
  @IsEnum(ProductoTipo)
  tipo: ProductoTipo;
}
