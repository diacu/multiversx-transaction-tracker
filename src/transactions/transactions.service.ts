import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async getTotalReceivedForWallet(
    walletAddress: string,
    coin: string,
  ): Promise<number> {
    const cached: number = await this.cacheManager.get(
      `${walletAddress}-${coin}-received`,
    );
    if (cached) {
      return cached;
    }

    const value = await this.transactionsRepository.findOneBy({
      walletAddress,
      coin,
    });
    this.cacheManager.set(
      `${walletAddress}-${coin}-received`,
      value?.amountReceived || 0,
    );
    return value?.amountReceived || 0;
  }

  async getTotalSentForWallet(
    walletAddress: string,
    coin: string,
  ): Promise<number> {
    const cached: number = await this.cacheManager.get(
      `${walletAddress}-${coin}-sent`,
    );
    if (cached) {
      return cached;
    }

    const value = await this.transactionsRepository.findOneBy({
      walletAddress,
      coin,
    });
    this.cacheManager.set(
      `${walletAddress}-${coin}-sent`,
      value?.amountSent || 0,
    );
    return value?.amountSent || 0;
  }

  async addReceivedForWallet(
    walletAddress: string,
    coin: string,
    value: string | number,
  ) {
    try {
      await this.prepareValues(walletAddress, coin);
      await this.transactionsRepository.increment(
        { walletAddress, coin },
        'amountReceived',
        value,
      );
      this.cacheManager.del(`${walletAddress}-${coin}-received`);
    } catch (e) {
      console.error(e);
    }
  }

  async addSentForWallet(
    walletAddress: string,
    coin: string,
    value: string | number,
  ) {
    try {
      await this.prepareValues(walletAddress, coin);
      await this.transactionsRepository.increment(
        { walletAddress, coin },
        'amountSent',
        value,
      );
      this.cacheManager.del(`${walletAddress}-${coin}-sent`);
    } catch (e) {
      console.error(e);
    }
  }

  private async prepareValues(walletAddress: string, coin: string) {
    const entity = await this.transactionsRepository.findOneBy({
      walletAddress,
      coin,
    });
    if (!entity) {
      await this.transactionsRepository.insert({
        walletAddress,
        coin,
      });
    }
  }
}
