import { IsString, IsNumber, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../products.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Figura Luffy Gear 5' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Japan', description: 'Si es Japan, se aplica arancel del 15%' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Alta calidad, PVC' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 45.50 })
  @IsNumber()
  @Min(0)
  cashPrice: number;

  @ApiProperty({ example: 0.50 })
  @IsNumber()
  @IsOptional()
  priceDeliveryDiscount: number;

  @ApiProperty({ example: 180.50 })
  @IsNumber()
  @IsOptional()
  bcvPrice: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  category_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  franchise_id: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({ enum: ProductStatus, default: ProductStatus.AVAILABLE })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    description: 'Imagen del producto para el Bucket de Google' 
  })
  image: any; // Usamos any aquí porque Multer lo manejará como un objeto de archivo

}