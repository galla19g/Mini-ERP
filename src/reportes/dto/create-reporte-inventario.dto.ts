import { IsString, IsArray, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReporteInventarioDto {
  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha y hora de generación del reporte',
  })
  @IsString()
  fecha_generacion!: string;

  @ApiProperty({
    type: Array,
    description: 'Array de productos del inventario',
    example: [
      {
        codigo: 'PROD-001',
        nombre: 'Laptop Dell',
        categoria: 'Electrónica',
        stock: 15,
        precio_unitario: 800.0,
        valor_total: 12000.0,
      },
    ],
  })
  @IsArray()
  productos!: Record<string, any>[];

  @ApiProperty({
    example: 150000.0,
    description: 'Valor total del inventario',
  })
  @IsNumber()
  @Min(0)
  valor_total_inventario!: number;

  @ApiProperty({
    example: 'Mini ERP',
    description: 'Nombre de la empresa',
    required: false,
  })
  @IsOptional()
  @IsString()
  empresa?: string;
}
