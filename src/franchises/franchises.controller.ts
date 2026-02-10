import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FranchisesService } from './franchises.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { Franchise } from './franchises.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';

@Controller('franchises')
@ApiTags('Franquicias')
@ApiSecurity('bearer')
export class FranchisesController {
    constructor(private readonly franchiseService: FranchisesService) {}
    
  @Post()
  @ApiOperation({ summary: 'Registrar una nueva franquicia' })
  @ApiResponse({ status: 201, description: 'Franquicia creada correctamente', type: Franchise })
  @ApiResponse({ status: 409, description: 'Error: El nombre de la franquicia ya existe' })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  async create(@Body() createFranchiseDto: CreateFranchiseDto) {
    return await this.franchiseService.create(createFranchiseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener listado de todas las franquicias' })
  @ApiResponse({ status: 200, description: 'Listado obtenido con éxito', type: [Franchise] })
  async findAll() {
    return await this.franchiseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar una franquicia por su ID' })
  @ApiResponse({ status: 200, description: 'Franquicia encontrada', type: Franchise })
  @ApiResponse({ status: 404, description: 'Franquicia no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.franchiseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una franquicia' })
  @ApiResponse({ status: 200, description: 'Datos actualizados', type: Franchise })
  @ApiResponse({ status: 404, description: 'No se encontró la franquicia para actualizar' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFranchiseDto: UpdateFranchiseDto,
  ) {
    return await this.franchiseService.update(id, updateFranchiseDto);
  }
}
