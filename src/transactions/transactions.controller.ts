import { Body, Controller, Get, Post } from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BalanceDto,
  CategoryDto,
  CreateTransactionRequestDto,
  DateDto,
  ListTransactionResponseDto,
  TransactionDto,
} from './dtos';

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
  async getAllTransactions(): Promise<ListTransactionResponseDto[]> {
    return await this.service.getAllTransactions();
  }

  @Get('by-category')
  @ApiResponse({
    status: 200,
    type: CategoryDto,
    isArray: true,
  })
  async getSumByCategory(): Promise<CategoryDto[]> {
    return (await this.service.getSumByCategory()).map(
      (c) => new CategoryDto(c),
    );
  }

  @Get('by-date')
  @ApiResponse({
    status: 200,
    type: DateDto,
    isArray: true,
  })
  async getSymByDate(): Promise<DateDto[]> {
    return (await this.service.getSumByDate()).map((d) => new DateDto(d));
  }

  @Get('balance')
  @ApiResponse({
    status: 200,
    type: BalanceDto,
  })
  async getBalance(): Promise<BalanceDto> {
    return await this.service.getBalance();
  }
}
