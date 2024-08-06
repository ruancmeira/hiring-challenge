import { Decimal } from '@prisma/client/runtime/library';

export const bankSlipToCreateMock = {
  name: 'Test Slip',
  governmentId: 123456789,
  email: 'test@example.com',
  debtAmount: new Decimal('100.12'),
  debtDueDate: new Date('2024-08-01'),
  debtId: '1',
};
