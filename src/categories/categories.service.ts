import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificamos si ya existe una categoría con ese nombre para evitar duplicados
    const existing = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existing) {
        throw new HttpException(`La categoría "${createCategoryDto.name}" ya existe`, HttpStatus.CONFLICT);
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { name: 'ASC' }, // Las devolvemos ordenadas alfabéticamente
      where: {status:"active"}
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    
    if (!category) {
        throw new HttpException(`Categoría con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    
    return category;
  }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const nameExists = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (nameExists) {
        throw new HttpException(`Ya existe otra categoría llamada "${updateCategoryDto.name}"`, HttpStatus.CONFLICT);
      }
    }

    const updatedCategory = Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(updatedCategory);
  }
}
