import { Injectable } from '@nestjs/common';
import { parse } from './parse';
import { Transaction } from 'src/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListTransactionResponseDto, TransactionDto } from './dtos';

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

  async getAllTransactions(): Promise<ListTransactionResponseDto[]> {
    const transactions = await this.repository.find({
      order: { date: 'DESC' },
    });

    if (transactions.length === 0) return null;

    const response: ListTransactionResponseDto[] = [];
    let curr = new ListTransactionResponseDto({
      date: transactions[0].date,
      transactions: [],
    });

    for (const transaction of transactions) {
      if (transaction.date.getTime() !== curr.date.getTime()) {
        response.push(curr);
        curr = new ListTransactionResponseDto({
          date: transaction.date,
          transactions: [],
        });
      }

      curr.transactions.push(transaction);
    }

    response.push(curr);

    return response;
  }

  async getSumByCategory() {
    return await this.repository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(transaction.amount)', 'amount')
      .groupBy('transaction.category')
      .orderBy('transaction.category', 'ASC')
      .getRawMany();
  }

  async getSumByDate() {
    return await this.repository
      .createQueryBuilder('transaction')
      .select('transaction.date', 'date')
      .addSelect('SUM(transaction.amount)', 'amount')
      .groupBy('transaction.date')
      .orderBy('transaction.date', 'ASC')
      .getRawMany();
  }
}
