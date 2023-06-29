import { Injectable } from '@nestjs/common';
import { TransactionsService } from './transactions/transactions.service';

@Injectable()
export class AppService {
  constructor(private transactionsService: TransactionsService) {}

  async getReceivedAmount(wallet: string, coin: string): Promise<number> {
    return await this.transactionsService.getTotalReceivedForWallet(
      wallet,
      coin,
    );
  }
  async getSentAmount(wallet: string, coin: string): Promise<number> {
    return await this.transactionsService.getTotalSentForWallet(wallet, coin);
  }
}
