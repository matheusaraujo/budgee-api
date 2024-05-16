import { Body, Controller, Get, Post } from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CategoryDto,
  CreateTransactionRequestDto,
  TransactionDto,
} from './dtos';
import { TransactionType } from './transaction.type';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: TransactionDto,
  })
  async createTransaction(
    @Body() request: CreateTransactionRequestDto,
  ): Promise<TransactionDto> {
    return new TransactionDto(
      await this.service.createTransaction(request.transaction),
    );
  }

  @Post('two')
  @ApiResponse({
    status: 201,
    type: TransactionDto,
  })
  async createTransaction2(
    @Body() request: TransactionDto,
  ): Promise<TransactionDto> {
    return new TransactionDto(await this.service.createTransaction2(request));
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: TransactionDto,
    isArray: true,
  })
  async getAllTransactions(): Promise<TransactionType[]> {
    return await this.service.getAllTransactions();
  }

  @Get('by-category')
  @ApiResponse({
    status: 200,
    type: CategoryDto,
    isArray: true,
  })
  async getSumByCategory() {
    return (await this.service.getSumByCategory()).map(
      (c) => new CategoryDto(c),
    );
  }
}
