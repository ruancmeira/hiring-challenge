import { Decimal } from '@prisma/client/runtime/library';

export interface BankSlip {
  id: number;
  name: string;
  governmentId: number;
  email: string;
  debtAmount: Decimal;
  debtDueDate: Date;
  debtId: string;
  createdAt: Date;
  updatedAt: Date;
}
