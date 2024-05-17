import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class DateDto {
  @IsDate()
  @ApiProperty({ example: '2024-05-17' })
  date: Date;

  @IsNumber()
  @ApiProperty({ example: 123.45 })
  amount: number;

  public constructor(init?: Partial<DateDto>) {
    Object.assign(this, init);
  }
}
