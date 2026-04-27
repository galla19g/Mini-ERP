import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearProveedorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contacto: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  telefono: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
