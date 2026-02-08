import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user') // Asegúrate de que coincida con el nombre en tu SQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  lastname: string;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({
    type: 'enum',
    enum: ['active', 'disabled'], // Ajusta según tu status_generic
    default: 'active'
  })
  status: string;

  @Column({ length: 255, nullable: true })
  instagram: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  refercode: string;

  @Column({ length: 255 }) // Password oculto en consultas por defecto
  password: string;

  @Column({ type: 'boolean', default: true })
  notify: boolean;

  @Column({ length: 50, nullable: true })
  temcode: string;

  @Column({ type: 'timestamp', nullable: true })
  temcode_expires_at: Date;

  @Column({
    type: 'enum',
    enum: ['client', 'admin', 'delivery'], // Ajusta según tu user_role
    default: 'client'
  })
  rol: string;

  @Column({ length: 20, nullable: true })
  phone_number: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}