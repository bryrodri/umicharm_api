import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('franchise')
export class Franchise {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Franquicia Norte' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: 'Distribuidora principal de la región norte', nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 'active' })
  @Column({
    type: 'enum',
    enum: ['active', 'disabled'], // Ajusta según tu status_generic
    default: 'active'
  })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

//   @OneToMany(() => ClienteActividad, cliente => cliente.actividad)
//   clienteActividades: ClienteActividad[]
}