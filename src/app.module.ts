import { Module } from '@nestjs/common';
// import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionProcessorModule } from './transaction-processor/transaction-processor.module';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // CacheModule.register({ isGlobal: true }),
    // ClientsModule.registerAsync([
    //   //   {
    //   //     name: 'RABBITMQ_SERVICE',
    //   //     useFactory: async (configService: ConfigService) => ({
    //   //       transport: Transport.RMQ,
    //   //       options: {
    //   //         urls: [configService.get<string>('RABBITMQ_URL')],
    //   //         queue: 'cache_invalidation',
    //   //         queueOptions: {
    //   //           durable: false,
    //   //         },
    //   //       },
    //   //     }),
    //   //     inject: [ConfigService],
    //   //   },
    // ]),
    AuthModule,
    TransactionsModule,
    TransactionProcessorModule,
  ],
  controllers: [AppController],
  providers: [AppService, TransactionsService],
})
export class AppModule {}
