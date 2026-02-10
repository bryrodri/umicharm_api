import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

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

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;

    // 1. Verificar si el email o username ya existen
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new HttpException('This username is already registered.', HttpStatus.CONFLICT);
      
    }

    // 2. Encriptar contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. Crear instancia y guardar
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async create(createUserDto: CreateUserDto, rol: "client"|"delivery"): Promise<User> {
    const { email, username, password } = createUserDto;

    // 1. Verificar si el email o username ya existen
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new HttpException('This username is already registered.', HttpStatus.CONFLICT);
      
    }

    // 2. Encriptar contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. Crear instancia y guardar
    const newUser = this.usersRepository.create({
      ...createUserDto,
      rol:rol,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(`Usuario con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Reutiliza la validación de findOne

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
      updateUserDto.password = hashedPassword;
    }

    const updatedUser = Object.assign(user, updateUserDto);
    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.status="disabled"
    return await this.usersRepository.save(user);
  }

  async active(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.status="active"
    return await this.usersRepository.save(user);
  }


}
