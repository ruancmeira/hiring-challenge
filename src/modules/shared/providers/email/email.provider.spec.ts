import { bankSlipToCreateMock } from '@modules/bank-slips/services/create-many/mocks';
import { EmailProvider } from './email.provider';
import { BankSlip } from '@modules/bank-slips/interfaces';

describe('EmailProvider', () => {
  let emailProvider: EmailProvider;

  beforeEach(() => {
    emailProvider = new EmailProvider();
    jest.spyOn(console, 'log').mockImplementation(() => 'E-mail enviado!');
  });

  it('should return the same bank slips that are passed in', async () => {
    const createdBankSlipMock: BankSlip = {
      id: 1,
      ...bankSlipToCreateMock,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await emailProvider.send(
      createdBankSlipMock,
      createdBankSlipMock,
    );

    expect(result).toEqual([createdBankSlipMock, createdBankSlipMock]);
  });

  it('should log "E-mail enviado!" to the console', async () => {
    const createdBankSlipMock: BankSlip = {
      id: 1,
      ...bankSlipToCreateMock,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await emailProvider.send(createdBankSlipMock, createdBankSlipMock);

    expect(console.log).toHaveBeenCalledWith('E-mail enviado!');
  });
});
