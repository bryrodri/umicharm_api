import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CarouselType {
  LARGE = 'large',
  SMALL = 'small',
}

@Entity('carousel')
export class Carousel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CarouselType,
    default: CarouselType.SMALL,
  })
  type: CarouselType;

  @Column({ name: 'button_text', nullable: true })
  buttonText: string;

  @Column({ name: 'button_redirect', nullable: true })
  buttonRedirect: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  tag: string;

  @Column()
  image: string; // Aquí guardaremos la URL de Google Cloud Storage
}