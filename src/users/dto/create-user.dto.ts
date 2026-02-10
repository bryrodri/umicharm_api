import { IsEmail, IsString, IsOptional, MinLength, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Luis' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Comunica' })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiProperty({ example: 'luisito77' })
  @IsString()
  @MaxLength(100)
  username: string;

  @ApiProperty({ example: 'luis@example.com' })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ example: '@luisito', required: false })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({ example: 'REF123', required: false })
  @IsString()
  @IsOptional()
  refercode?: string;

  @ApiProperty({ example: '+584120000000', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  notify?: boolean;
}