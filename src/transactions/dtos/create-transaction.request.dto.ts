import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTransactionRequestDto {
  @IsString()
  @ApiProperty({ example: '#category description @2024-05-09 123.45' })
  transaction: string;

  public constructor(init?: Partial<CreateTransactionRequestDto>) {
    Object.assign(this, init);
  }
}
