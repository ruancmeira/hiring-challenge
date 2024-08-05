import { CsvParserOptionsValidator } from '@modules/shared/utils/csv-parser/types';
import { CsvHeader } from '../enums';

export const bodyValidator: CsvParserOptionsValidator<typeof CsvHeader> = {
  NAME: {
    transform: (data) => data?.trim(),
    validate: (data: string) => !!data?.trim(),
    preparePayload: (data: string) => ({
      name: data,
    }),
  },
  GOVERNMENT_ID: {
    transform: (data) => Number(data?.trim()),
    validate: (data: number) => !isNaN(data) && data > 0,
    preparePayload: (data: number) => ({ governmentId: data }),
  },
  EMAIL: {
    transform: (data) => data?.trim(),
    validate: (data: string) => !!data?.trim(),
    preparePayload: (data: number) => ({ email: data }),
  },
  DEBT_AMOUNT: {
    transform: (data) => Number(data?.trim()),
    validate: (data: number) => !isNaN(data) && data >= -1,
    preparePayload: (data: number) => ({ debtAmount: data }),
  },
  DEBT_DUE_DATE: {
    transform: (data) => data?.trim(),
    validate: (data: string) => !!data?.trim(),
    preparePayload: (data: string) => ({
      debtDueDate: data,
    }),
  },
  DEBT_ID: {
    transform: (data) => data?.trim(),
    validate: (data: string) => !!data?.trim(),
    preparePayload: (data: string) => ({
      debtId: data,
    }),
  },
};
