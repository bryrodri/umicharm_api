import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigApp } from './config-app.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigAppService {
    constructor(
        @InjectRepository(ConfigApp)
        private configApptRepository: Repository<ConfigApp>,
    ){}

    async getBcvDifference(){
        let p = await this.configApptRepository.findOne({where:{id: 1}});
        return p?.bcv_difference || 1
    }
}
