import { IsString, IsArray, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReporteVentasDto {
  @ApiProperty({
    example: '2024-01-01',
    description: 'Fecha de inicio del período a reportar',
  })
  @IsString()
  fecha_inicio!: string;

  @ApiProperty({
    example: '2024-01-31',
    description: 'Fecha de fin del período a reportar',
  })
  @IsString()
  fecha_fin!: string;

  @ApiProperty({
    type: Array,
    description: 'Array de ventas con detalles',
    example: [
      {
        fecha: '2024-01-15',
        cliente: 'Juan Pérez',
        producto: 'Laptop',
        cantidad: 2,
        precio_unitario: 500.0,
        total: 1000.0,
      },
    ],
  })
  @IsArray()
  ventas!: Record<string, any>[];

  @ApiProperty({
    example: 5000.0,
    description: 'Total general de ventas',
  })
  @IsNumber()
  @Min(0)
  total_general!: number;

  @ApiProperty({
    example: 10,
    description: 'Cantidad de registros procesados',
  })
  @IsNumber()
  cantidad_registros!: number;

  @ApiProperty({
    example: 'Mini ERP',
    description: 'Nombre de la empresa',
    required: false,
  })
  @IsOptional()
  @IsString()
  empresa?: string;
}
