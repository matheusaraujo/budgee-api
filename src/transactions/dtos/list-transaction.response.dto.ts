import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate } from 'class-validator';
import { TransactionDto } from './transaction.dto';

export class ListTransactionResponseDto {
  @IsDate()
  @ApiProperty({ example: '2024-08-17' })
  date: Date;

  @IsArray()
  transactions: TransactionDto[];

  public constructor(init?: Partial<ListTransactionResponseDto>) {
    Object.assign(this, init);
  }
}
