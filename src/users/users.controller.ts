import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('users')
@ApiTags('Users')
@ApiSecurity('bearer')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado con éxito', type: User })
  @ApiResponse({ status: 409, description: 'Conflicto: Email o Username ya existen' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  async findAll() {
    return await this.usersService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Patch('active/:id')
  @ApiOperation({ summary: 'Activar un usuario' })
  @ApiResponse({ status: 204, description: 'Usuario activado' })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  async active(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.active(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
