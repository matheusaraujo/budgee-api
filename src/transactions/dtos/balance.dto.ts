import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BalanceDto {
  @IsNumber()
  @ApiProperty({ example: 123.45 })
  balance: number;

  public constructor(init?: Partial<BalanceDto>) {
    Object.assign(this, init);
  }
}
