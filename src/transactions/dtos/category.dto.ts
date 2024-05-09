import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  @ApiProperty({ example: 'category' })
  category: string;

  @IsNumber()
  @ApiProperty({ example: 123.45 })
  amount: number;

  public constructor(init?: Partial<CategoryDto>) {
    Object.assign(this, init);
  }
}
