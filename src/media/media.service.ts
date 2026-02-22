import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';

@Injectable()
export class MediaService {
    private storage: Storage;
    private bucketName: string;

    constructor(private configService: ConfigService) {
    const name = this.configService.get<string>('GCP_BUCKET_NAME');
  
    if (!name) {
        throw new Error('GCP_BUCKET_NAME no está definido en el archivo .env');
    }
    this.bucketName = name
    
    // Inicializamos Storage con la llave JSON del .env
    try {
        const projectId = this.configService.get<string>('GCP_PROJECT_ID');
        const storageKey = this.configService.get<string>('GCP_STORAGE_KEY');
        if (!projectId || !storageKey) {
            throw new Error('Faltan variables de entorno para Google Cloud Storage');
        }
        this.storage = new Storage({
            projectId: projectId,
            credentials: JSON.parse(storageKey),
        });
    } catch (error) {
      throw new InternalServerErrorException('Error al configurar Google Cloud Storage. Revisa la GCP_STORAGE_KEY en el .env');
    }
  }

async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const bucket = this.storage.bucket(this.bucketName);
    // Creamos un nombre único: carpeta/timestamp_extension
    const fileName = `${folder}/${Date.now()}${extname(file.originalname)}`;
    const cloudFile = bucket.file(fileName);

    // Creamos un Stream para subir el archivo sin guardarlo físicamente en el servidor
    const stream = cloudFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(new InternalServerErrorException(`Error al subir a GCS: ${err.message}`));
      });

      stream.on('finish', () => {
        // Retornamos la URL pública
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        resolve(publicUrl);
      });

      stream.end(file.buffer);
    });
  }
}
