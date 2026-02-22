import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Franchise } from './franchises.entity';
import { Repository } from 'typeorm';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';

@Injectable()
export class FranchisesService {
    constructor(
    @InjectRepository(Franchise)
    private readonly franchiseRepository: Repository<Franchise>,
  ) {}
  
    async create(createFranchiseDto: CreateFranchiseDto): Promise<Franchise> {
        // Verificamos si ya existe una franquicia con ese nombre
        const existing = await this.franchiseRepository.findOne({
        where: { name: createFranchiseDto.name },
        });

        if (existing) {
            throw new HttpException(`La franquicia "${createFranchiseDto.name}" ya está registrada`, HttpStatus.CONFLICT);
        }

        const newFranchise = this.franchiseRepository.create(createFranchiseDto);
        return await this.franchiseRepository.save(newFranchise);
    }

    async findAll(): Promise<Franchise[]> {
    return await this.franchiseRepository.find({
      order: { name: 'ASC' }, // Ordenadas alfabéticamente para facilitar la vista al cliente
      where: {status :"active"}
    });
  }

    async findOne(id: number): Promise<Franchise> {
        const franchise = await this.franchiseRepository.findOneBy({ id });
        
        if (!franchise) {
            throw new HttpException(`Franquicia con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);

        }  
        return franchise;
    }

    async update(id: number, updateFranchiseDto: UpdateFranchiseDto): Promise<Franchise> {
    // Validamos que exista antes de intentar editar
    const franchise = await this.findOne(id);

    // Si se cambia el nombre, validamos que el nuevo nombre no esté duplicado
    if (updateFranchiseDto.name && updateFranchiseDto.name !== franchise.name) {
      const nameExists = await this.franchiseRepository.findOne({
        where: { name: updateFranchiseDto.name },
      });
      if (nameExists) {
        
        throw new HttpException(`Ya existe otra franquicia con el nombre "${updateFranchiseDto.name}"`, HttpStatus.CONFLICT);

      }
    }

    // Fusionamos cambios y guardamos en Supabase
    const updatedFranchise = Object.assign(franchise, updateFranchiseDto);
    return await this.franchiseRepository.save(updatedFranchise);
  }
}
