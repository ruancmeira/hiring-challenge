import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BankSlipsModule } from '@modules/bank-slips/bank-slips.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BankSlipsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
