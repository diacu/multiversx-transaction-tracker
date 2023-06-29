import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionProcessorService } from './transaction-processor.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  imports: [ScheduleModule.forRoot(), TransactionsModule],
  providers: [TransactionProcessorService, TransactionsService],
})
export class TransactionProcessorModule {}
