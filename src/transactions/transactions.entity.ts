import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['walletAddress', 'coin'], { unique: true })
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 300 })
  walletAddress: string;

  @Column({ type: 'varchar', length: 300 })
  coin: string;

  @Column({ type: 'bigint', default: 0 })
  amountReceived: number;

  @Column({ type: 'bigint', default: 0 })
  amountSent: number;
}
