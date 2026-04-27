import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
