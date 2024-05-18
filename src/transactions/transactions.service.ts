import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository, ReturnDocument } from 'typeorm';
import { ListTransactionResponseDto, TransactionDto } from './dtos';
import { adjustAmount, getType, parse } from './parse';
import { TransactionType } from './transaction.type';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async createTransaction(input: string): Promise<Transaction> {
    return await this._createTransaction(parse(input));
  }

  async createTransaction2(input: TransactionDto): Promise<Transaction> {
    return await this._createTransaction(input);
  }

  async _createTransaction(transaction: TransactionType): Promise<Transaction> {
    transaction.amount = adjustAmount(transaction);
    transaction.type = getType(transaction);
    return await this.repository.save(transaction);
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

  async getBalance(year: string | undefined, month: string | undefined) {
    // if (year === undefined && month === undefined) {
    //   return await this.repository
    //     .createQueryBuilder('transaction')
    //     .select('SUM(transaction.amount)', 'balance')
    //     .addSelect(':referenceDate', 'referenceDate')
    //     .where('transaction.date < :referenceDate', {
    //       referenceDate: new Date(),
    //     })
    //     .getRawOne();
    // } else if (month === undefined) {
    //   return await this.repository
    //     .createQueryBuilder('transaction')
    //     .select('SUM(transaction.amount)', 'balance')
    //     .addSelect(':referenceDate', 'referenceDate')
    //     .where('transaction.date < :referenceDate', {
    //       referenceDate: new Date(parseInt(year || '0', 10), 11, 31),
    //     })
    //     .getRawOne();
    // } else {
    //   return await this.repository
    //     .createQueryBuilder('transaction')
    //     .select('SUM(transaction.amount)', 'balance')
    //     .addSelect(':referenceDate', 'referenceDate')
    //     .where('transaction.date < :referenceDate', {
    //       referenceDate: new Date(
    //         parseInt(year || '0', 10),
    //         parseInt(month || '0', 10),
    //         0,
    //       ),
    //     })
    //     .getRawOne();
    // }

    let referenceDate: Date;
    let initialReferenceDate: Date;
    let includeDetails = false;
    if (year === undefined && month === undefined) {
      referenceDate = new Date();
    } else if (month === undefined) {
      initialReferenceDate = new Date(parseInt(year || '0', 10), 0, 1);
      referenceDate = new Date(parseInt(year || '0', 10), 11, 31);
      includeDetails = true;
    } else {
      initialReferenceDate = new Date(
        parseInt(year || '0', 10),
        parseInt(month || '0', 10) - 1,
        1,
      );
      referenceDate = new Date(
        parseInt(year || '0', 10),
        parseInt(month || '0', 10),
        0,
      );
      includeDetails = true;
    }

    if (!includeDetails) {
      const query = `
        SELECT ? as referenceDate, SUM(t1.amount) AS balance
        FROM transaction t1
        WHERE t1.date <= ?
      `;

      return (
        await this.repository.query(query, [referenceDate, referenceDate])
      )[0];
    } else {
      const query = `
        SELECT
          ? as referenceDate,
          ? as initialReferenceDate,
          (SELECT IFNULL(SUM(t1.amount),0) FROM transaction t1 WHERE t1.date < ?) as previousBalance,
          (SELECT IFNULL(SUM(t2.amount),0) FROM transaction t2 WHERE t2.date <= ?) as balance,
          (SELECT IFNULL(SUM(t3.amount),0) FROM transaction t3 WHERE t3.date BETWEEN ? and ?) as balanceInPeriod,
          (SELECT IFNULL(SUM(t4.amount),0) FROM transaction t4 WHERE t4.type = "income" and t4.date BETWEEN ? and ?) AS income,
          (SELECT IFNULL(SUM(t5.amount),0) FROM transaction t5 WHERE t5.type = "expense" and t5.date BETWEEN ? and ?) AS expense,
          (SELECT IFNULL(SUM(t6.amount),0) FROM transaction t6 WHERE t6.type = "savings" and t6.date BETWEEN ? and ?) AS savings
      `;

      // TODO: try to not use positional args
      return (
        await this.repository.query(query, [
          referenceDate,
          initialReferenceDate,
          initialReferenceDate,
          referenceDate,
          initialReferenceDate,
          referenceDate,
          initialReferenceDate,
          referenceDate,
          initialReferenceDate,
          referenceDate,
          initialReferenceDate,
          referenceDate,
        ])
      )[0];
    }
  }
}
