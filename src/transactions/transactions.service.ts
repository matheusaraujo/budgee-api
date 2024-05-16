import { Injectable } from '@nestjs/common';
import { parse } from './parse';
import { Transaction } from 'src/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDto } from './dtos';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async createTransaction(input: string): Promise<Transaction> {
    return await this.repository.save(parse(input));
  }

  async createTransaction2(input: TransactionDto): Promise<Transaction> {
    return await this.repository.save(input);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.repository.find();
  }

  async getSumByCategory() {
    return await this.repository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(transaction.amount)', 'amount')
      .groupBy('transaction.category')
      .getRawMany();
  }
}
