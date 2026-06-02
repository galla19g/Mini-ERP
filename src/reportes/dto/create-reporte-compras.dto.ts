import { IsString, IsArray, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReporteComprasDto {
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
    description: 'Array de compras con detalles',
    example: [
      {
        fecha: '2024-01-15',
        proveedor: 'Distribuidor XYZ',
        producto: 'Componentes',
        cantidad: 100,
        precio_unitario: 50.0,
        total: 5000.0,
      },
    ],
  })
  @IsArray()
  compras!: Record<string, any>[];

  @ApiProperty({
    example: 25000.0,
    description: 'Total general de compras',
  })
  @IsNumber()
  @Min(0)
  total_general!: number;

  @ApiProperty({
    example: 15,
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
