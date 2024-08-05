import { Module } from '@nestjs/common';
import { BankSlipsController } from '@modules/bank-slips/controllers/bank-slips.controller';

import { CreateManyBankSlipService } from '@modules/bank-slips/services/create-many/create-many.service';
import { ProcessCsvService } from '@modules/bank-slips/services/process-csv/process-csv.service';
import { PrismaService } from '@modules/prisma/services/prisma.service';
import { EmailProvider, PDFProvider } from '@modules/shared/providers';

@Module({
  imports: [],
  controllers: [BankSlipsController],
  providers: [
    CreateManyBankSlipService,
    ProcessCsvService,
    PrismaService,
    PDFProvider,
    EmailProvider,
  ],
})
export class BankSlipsModule {}
