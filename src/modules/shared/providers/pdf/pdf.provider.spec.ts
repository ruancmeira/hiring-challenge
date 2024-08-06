import { bankSlipToCreateMock } from '@modules/bank-slips/services/create-many/mocks';
import { PDFProvider } from './pdf.provider';
import { BankSlip } from '@modules/bank-slips/interfaces';

describe('PDFProvider', () => {
  let pdfProvider: PDFProvider;

  beforeEach(() => {
    pdfProvider = new PDFProvider();

    jest.spyOn(console, 'log').mockImplementation(() => 'Boleto PDF gerado!');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the same bank slip that is passed in', async () => {
    const createdBankSlipMock: BankSlip = {
      id: 1,
      ...bankSlipToCreateMock,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await pdfProvider.generateBankSlip(createdBankSlipMock);

    expect(result).toEqual(createdBankSlipMock);
  });

  it('should log "Boleto PDF gerado!" to the console', async () => {
    const createdBankSlipMock: BankSlip = {
      id: 1,
      ...bankSlipToCreateMock,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await pdfProvider.generateBankSlip(createdBankSlipMock);

    expect(console.log).toHaveBeenCalledWith('Boleto PDF gerado!');
  });
});
