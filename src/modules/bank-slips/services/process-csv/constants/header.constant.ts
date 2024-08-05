import { CsvParserOptionsHeader } from '@modules/shared/utils/csv-parser/types';
import { CsvHeader } from '../enums';

export const headerMapper: CsvParserOptionsHeader<typeof CsvHeader> = {
  NAME: 'name',
  GOVERNMENT_ID: 'governmentId',
  EMAIL: 'email',
  DEBT_AMOUNT: 'debtAmount',
  DEBT_DUE_DATE: 'debtDueDate',
  DEBT_ID: 'debtId',
};
