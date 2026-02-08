import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    const user= await this.usersRepository.findOne(
      { where: { email }
    });

    if (!user) {
    throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
  
    return user;
  }


}
