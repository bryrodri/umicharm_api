import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { ILike, In, Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ConfigAppService } from 'src/config-app/config-app.service';

@Injectable()
export class ProductsService {
    constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly mediaService: MediaService, 
    private readonly configService:ConfigAppService,
  ) {}

    async create(createProductDto: CreateProductDto, imageFile: Express.Multer.File) {
    // 1. Subir la imagen al bucket (carpeta 'products')
    const imageUrl = await this.mediaService.uploadFile(imageFile, 'products');

    // 2. Crear la instancia del producto con la URL de la imagen

    const productData: Partial<Product> = {
    name: createProductDto.name,
    description: createProductDto.description,
    location: createProductDto.location,
    cashPrice: Number(createProductDto.cashPrice),
    bcvPrice: Number(createProductDto.bcvPrice),
    quantity: Number(createProductDto.quantity),
    categoryId: Number(createProductDto.category_id), // Mapeo de snake_case a camelCase
    franchiseId: Number(createProductDto.franchise_id),
    priceDeliveryDiscount: Number(createProductDto.priceDeliveryDiscount),
    status: createProductDto.status,
    image: imageUrl, // Ahora TS sabe que 'image' pertenece a Product
    };
    const newProduct = this.productRepository.create(productData);

    // 3. Guardar (Aquí se disparará el @BeforeInsert para el arancel del 15% si es Japan)
    return await this.productRepository.save(newProduct);
  }


  async findAll(
    {
        skip,
        take,
        name,
        categoryArray, // Recibimos el array de sets aquí
        franchiseArray,
        statusArray
    }: {
        skip: number;
        take: number;
        name?: string;
        categoryArray?: string[];
        franchiseArray?: string[]
        statusArray?: string[]

    }
  ): Promise<{ products: Product[]; total: number }> {
    
    const whereCondition: any = {};

    if (name) {
      whereCondition.name = ILike(`%${name}%`);
    }

    if (categoryArray && categoryArray.length > 0) {
      whereCondition.categoryId = In(categoryArray);
    }

    if (franchiseArray && franchiseArray.length > 0) {
      whereCondition.franchiseId = In(franchiseArray);
    }
  
    if (statusArray && statusArray.length > 0) {
      whereCondition.status = In(statusArray);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where: whereCondition,
      skip,
      take,
      relations: ['category', 'franchise'],
      order: {
        sortOrder: 'ASC',
        createdAt: 'ASC',
      },
    });

    const bcv_difference= await this.configService.getBcvDifference()

    const updatedProducts = products.map(item => {
      const originalPrice = item.cashPrice;
      const increasedPrice = originalPrice * (bcv_difference);
            
      const roundedPrice = Math.round(increasedPrice * 10) / 10;
      item.bcvPrice = roundedPrice;
      return item;
      });


    return { products:updatedProducts, total };
  }
}
