import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.type';
import { parse } from './parse';

@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = [];

  createTransaction(input: string): Transaction {
    const transaction = parse(input);
    this.transactions.push(transaction);
    return transaction;
  }

  getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  getSumByCategory() {
    const categoryMap: { [key: string]: number } = {};

    this.transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    return Object.keys(categoryMap).map((category) => ({
      category,
      amount: categoryMap[category],
    }));
  }
}
