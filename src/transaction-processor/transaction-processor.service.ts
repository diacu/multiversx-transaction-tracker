import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  TransactionProcessorMode,
  TransactionProcessor,
  ShardTransaction,
} from '@multiversx/sdk-transaction-processor';
import { Locker } from './utils/locker';
import { TokenTransfer } from '@multiversx/sdk-core';
import {
  TransactionDecoder,
  TransactionMetadata,
} from '@multiversx/sdk-transaction-decoder/lib/src/transaction.decoder';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class TransactionProcessorService {
  // private readonly logger: Logger;
  private lastNonce: number | undefined;
  private readonly transactionProcessor = new TransactionProcessor();
  // constructor() {
  // this.logger = new Logger(TransactionProcessorService.name);
  // }
  constructor(private transactionsService: TransactionsService) {}

  @Cron('*/1 * * * * *')
  async handleNewMultiversxTransactions() {
    Locker.lock('newMultiversxTransactions', async () => {
      await this.transactionProcessor.start({
        mode: TransactionProcessorMode.Hyperblock,
        // gatewayUrl: 'https://gateway.multiversx.com', // mainnet
        // gatewayUrl: 'https://testnet-gateway.multiversx.com', // testnet
        gatewayUrl: 'https://devnet-gateway.multiversx.com', // devnet
        getLastProcessedNonce: async (
          _shardId: number,
          _currentNonce: number,
        ) => {
          // In ProcessByHyperblockTransactions shardId will always be METACHAIN
          return this.lastNonce;
        },
        setLastProcessedNonce: async (_shardId: number, nonce: number) => {
          // In ProcessByHyperblockTransactions shardId will always be METACHAIN
          this.lastNonce = nonce;
        },
        onTransactionsReceived: async (
          shardId: number,
          nonce: number,
          transactions: ShardTransaction[],
        ) => {
          console.log(
            `Received ${transactions.length} transactions on shard ${shardId} and nonce ${nonce}`,
          );
          transactions.forEach(async (transaction: ShardTransaction) => {
            if (transaction.status !== 'success') {
              return;
            }
            if (
              transaction.getDataFunctionName() === 'ESDTTransfer' &&
              transaction.value === '0'
            ) {
              // ESDT Transfer.
              const metadata = new TransactionDecoder().getTransactionMetadata({
                sender: transaction.sender,
                receiver: transaction.receiver,
                data: transaction.data,
                value: transaction.value,
              });
              if (metadata && metadata.transfers) {
                const identifier = metadata.transfers[0].properties.identifier;
                const value = metadata.transfers[0].value.valueOf();

                await this.transactionsService.addReceivedForWallet(
                  transaction.receiver,
                  metadata.transfers[0].properties.identifier,
                  value.toString(),
                );
                await this.transactionsService.addSentForWallet(
                  transaction.sender,
                  metadata.transfers[0].properties.identifier,
                  value.toString(),
                );
              }
            } else {
              // EGLD transfer.
              await this.transactionsService.addReceivedForWallet(
                transaction.receiver,
                'EGLD',
                transaction.value,
              );
              await this.transactionsService.addSentForWallet(
                transaction.sender,
                'EGLD',
                transaction.value,
              );
            }
          });
        },
      });
    });
  }
}
