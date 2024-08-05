import { BankSlip } from '@modules/bank-slips/interfaces';

export class PDFProvider {
  public async generateBankSlip(bankSlip: BankSlip): Promise<BankSlip> {
    // TODO: funcionalidade geração do boleto - NÃO IMPLEMENTADO, retornando BankSlip

    console.log('Boleto PDF gerado!');

    return bankSlip;
  }
}
