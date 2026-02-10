import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('categories')
@ApiTags('Categorías')
@ApiSecurity('bearer')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiResponse({ status: 201, description: 'Categoría creada con éxito', type: Category })
    @ApiResponse({ status: 409, description: 'Conflicto: El nombre ya existe' })
    @UseGuards(JwtAuthGuard, RolesGuard) 
    @Roles('admin') 
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas las categorías' })
    @ApiResponse({ status: 200, description: 'Lista de categorías', type: [Category] })
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una categoría por ID' })
    @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una categoría' })
    @ApiResponse({ status: 200, description: 'Categoría actualizada con éxito', type: Category })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    @UseGuards(JwtAuthGuard, RolesGuard) 
    @Roles('admin') 
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return await this.categoriesService.update(id, updateCategoryDto);
    }
}
