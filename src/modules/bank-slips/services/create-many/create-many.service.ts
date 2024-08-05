import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/services/prisma.service';
import { EmailProvider, PDFProvider } from '@modules/shared/providers';
import { CreateManyBankSlipParams } from './interfaces';

@Injectable()
export class CreateManyBankSlipService {
  public constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
    @Inject(PDFProvider)
    private readonly pdfProvider: PDFProvider,
    @Inject(EmailProvider)
    private readonly emailProvider: EmailProvider,
  ) {}

  async execute(bankSlipsToCreate: CreateManyBankSlipParams[]): Promise<void> {
    for await (const bankSlipToCreate of bankSlipsToCreate) {
      try {
        const { debtId, debtDueDate, debtAmount, email, governmentId, name } =
          bankSlipToCreate;

        const createdBankSlip = await this.prisma.bankSlip.create({
          data: {
            name,
            governmentId: Number(governmentId),
            email,
            debtAmount,
            debtDueDate: new Date(debtDueDate),
            debtId,
          },
        });

        const pdfBankSlip = await this.pdfProvider.generateBankSlip(
          createdBankSlip,
        );

        await this.emailProvider.send(pdfBankSlip, createdBankSlip);
      } catch (error) {}
    }
  }
}
