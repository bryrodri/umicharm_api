import { Body, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('products')
@ApiTags('Productos')
@ApiSecurity('bearer')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Post()
    @ApiConsumes('multipart/form-data') // Necesario para Swagger
    @UseGuards(JwtAuthGuard, RolesGuard) 
    @Roles('admin') 
    @UseInterceptors(FileInterceptor('image')) // 'image' es el nombre del campo en el form
    async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.productService.create(createProductDto, file);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 10,
        @Query('name') name?: string,
        @Query('category') category?: string, 
        @Query('franchise') franchise?: string ,
        @Query('status') status?: string 

    ) {
        const pageInt = parseInt(page as any, 10);
        const limitInt = parseInt(limit as any, 10);
        const take = limitInt > 100 ? 100 : limitInt;
        const skip = (pageInt - 1) * take;

        const categoryArray = category ? category.split(',') : undefined;
        const franchiseArray = franchise ? franchise.split(",") :undefined
        const statusArray = status ? status.split(",") :undefined

        const { products, total } = await this.productService.findAll({
                skip,
                take,
                name,
                categoryArray,
                franchiseArray,
                statusArray
            });

        return {
                products,
                total,
                page: pageInt,
                last_page: Math.ceil(total / take),
            };

    }
}
