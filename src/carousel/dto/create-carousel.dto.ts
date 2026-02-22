import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarouselType } from '../carousel.entity';

export class CreateCarouselDto {
  @ApiProperty({ enum: CarouselType, default: CarouselType.SMALL })
  @IsEnum(CarouselType)
  @IsOptional()
  type?: CarouselType;

  @ApiProperty({ example: 'Comprar ahora', required: false })
  @IsString()
  @IsOptional()
  buttonText?: string;

  @ApiProperty({ example: '/productos/figuras', required: false })
  @IsString()
  @IsOptional()
  buttonRedirect?: string;

  @ApiProperty({ example: 'Novedades de Japón' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Descubre las nuevas figuras con arancel preferencial', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Nuevo', required: false })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    description: 'Imagen promocional para el carrusel' 
  })
  image: any;
}