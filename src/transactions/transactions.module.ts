import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from 'src/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [TypeOrmModule.forFeature([Transaction])],
})
export class TransactionsModule {}
