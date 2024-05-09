import { Body, Controller, Get, Post } from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.type';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CategoryDto,
  CreateTransactionRequestDto,
  TransactionDto,
} from './dtos';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: TransactionDto,
  })
  createTransaction(
    @Body() request: CreateTransactionRequestDto,
  ): TransactionDto {
    return new TransactionDto(
      this.service.createTransaction(request.transaction),
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: TransactionDto,
    isArray: true,
  })
  getAllTransactions(): Transaction[] {
    return this.service.getAllTransactions();
  }

  @Get('by-category')
  @ApiResponse({
    status: 200,
    type: CategoryDto,
    isArray: true,
  })
  getSumByCategory() {
    return this.service.getSumByCategory().map((c) => new CategoryDto(c));
  }
}
