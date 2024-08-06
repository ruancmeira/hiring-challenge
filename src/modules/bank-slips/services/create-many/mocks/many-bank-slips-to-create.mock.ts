import { CreateManyBankSlipParams } from '../interfaces';

export const manyBankSlipsToCreateMock: CreateManyBankSlipParams[] = [
  {
    debtId: '1',
    debtDueDate: '2024-08-01',
    debtAmount: '100.12',
    email: 'test@example.com',
    governmentId: '123456789',
    name: 'Test Slip',
  },
  {
    debtId: '2',
    debtDueDate: '2024-09-01',
    debtAmount: '3453.12',
    email: 'test2@example.com',
    governmentId: '987654321',
    name: 'Test Slip 2',
  },
];
