import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '../enums/rol.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CrearUsuarioDto {
  @ApiProperty({ example: 'user@sigemp.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, default: Role.VENDEDOR })
  @IsEnum(Role)
  @IsOptional()
  rol?: Role;
}
