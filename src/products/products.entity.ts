import { 
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, 
  UpdateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate 
} from 'typeorm';
import { Category } from '../categories/categories.entity';
import { Franchise } from '../franchises/franchises.entity';

export enum ProductStatus {
  AVAILABLE = 'soon',
  OUT_OF_STOCK = 'sould out',
  DISCONTINUED = 'available',
}

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  location: string; // Ejemplo: 'Japan' o 'USA'

  @Column({ name: 'bcv_price', type: 'decimal', precision: 12, scale: 2 })
  bcvPrice: number;

  @Column({ nullable: true })
  image: string;

  @Column({ name: 'price_delivery_discount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  priceDeliveryDiscount: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.AVAILABLE })
  status: ProductStatus;

  @Column({ default: 0 })
  quantity: number;

  @Column({ name: 'sort_order', nullable: true })
  sortOrder: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column({ name: 'cash_price', type: 'decimal', precision: 12, scale: 2 })
  cashPrice: number;

  // Relaciones
  @ManyToOne(() => Category, category => category.products, {
    nullable:false,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Franchise, franchise => franchise.products,{
    nullable:false,
    onDelete:"CASCADE"
  })
  @JoinColumn({ name: 'franchise_id' })
  franchise: Franchise;

  @Column({ name: 'franchise_id' })
  franchiseId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;


}