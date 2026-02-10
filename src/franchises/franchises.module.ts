import { Module } from '@nestjs/common';
import { FranchisesService } from './franchises.service';
import { FranchisesController } from './franchises.controller';
import { Franchise } from './franchises.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Franchise])],
  providers: [FranchisesService],
  controllers: [FranchisesController]
})
export class FranchisesModule {}
