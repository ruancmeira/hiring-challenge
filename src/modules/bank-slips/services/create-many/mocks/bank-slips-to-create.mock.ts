import { CreateManyBankSlipParams } from '../interfaces';

export const bankSlipsToCreateMock: CreateManyBankSlipParams[] = [
  {
    debtId: '1',
    debtDueDate: '2024-08-01',
    debtAmount: '100.12',
    email: 'test@example.com',
    governmentId: '123456789',
    name: 'Test Slip',
  },
];
