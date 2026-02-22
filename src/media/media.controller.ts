import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('media')
@ApiTags('Media (Pruebas)')
@ApiSecurity('bearer')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload-test')
    @ApiOperation({ summary: 'Test de subida de imagen a Google Cloud' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            file: {
            type: 'string',
            format: 'binary',
            },
        },
        },
    })
  @UseInterceptors(FileInterceptor('file')) // El campo debe llamarse 'file'
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  async uploadTest(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Máximo 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Subimos a la carpeta 'tests' dentro del bucket
    const url = await this.mediaService.uploadFile(file, 'tests');
    
    return {
      message: '¡Subida exitosa!',
      url: url,
      fileName: file.originalname,
      size: file.size,
    };
  }
}
