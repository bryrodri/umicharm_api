import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { MediaModule } from 'src/media/media.module';
import { ConfigAppModule } from 'src/config-app/config-app.module';

@Module({
  imports:[TypeOrmModule.forFeature([Product]),MediaModule, ConfigAppModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
