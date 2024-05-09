import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  @ApiProperty({ example: 'category' })
  category: string;

  @IsString()
  @ApiProperty({ example: 'description' })
  description: string;

  @IsDate()
  @ApiProperty({ example: '2024-05-09' })
  date: Date;

  @IsNumber()
  @ApiProperty({ example: 123.45 })
  amount: number;

  public constructor(init?: Partial<TransactionDto>) {
    Object.assign(this, init);
  }
}
