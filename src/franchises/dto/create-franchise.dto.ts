import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFranchiseDto {
  @ApiProperty({ example: 'Umicharm Tokyo' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la franquicia es obligatorio' })
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Sede encargada de la logística en Japón', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}