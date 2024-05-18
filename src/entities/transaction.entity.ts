import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: string | undefined;
}
