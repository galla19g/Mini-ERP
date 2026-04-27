import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearClienteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  identificacion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  telefono: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
