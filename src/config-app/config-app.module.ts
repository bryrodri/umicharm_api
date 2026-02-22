import { Module } from '@nestjs/common';
import { ConfigAppService } from './config-app.service';
import { ConfigApp } from './config-app.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigApp])],
  providers: [ConfigAppService],
   exports: [ConfigAppService, ConfigAppModule]
})
export class ConfigAppModule {}
