import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("config")
export class ConfigApp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  bcv_difference: number;

}
