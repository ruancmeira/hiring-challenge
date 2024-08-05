import { BankSlip } from '@modules/bank-slips/interfaces';

export class EmailProvider {
  public async send(
    pdfBankSlip: BankSlip,
    createdBankSlip: BankSlip,
  ): Promise<BankSlip[]> {
    // TODO: funcionalidade envio de e-mail - NÃO IMPLEMENTADO, retornando BankSlip[]

    console.log('E-mail enviado!');

    return [pdfBankSlip, createdBankSlip];
  }
}
