import { CsvParserHeaderEnum } from '../enums';
import { CsvParserRow } from '../types';

export interface CsvParserValidatorProps<CsvEnum extends CsvParserHeaderEnum> {
  transform?: (data: string) => any;
  hasPayload?: (data: any, row: CsvParserRow<CsvEnum>) => boolean;
  validate: (data: any, row: CsvParserRow<CsvEnum>) => boolean;
  preparePayload: (
    data: any,
    row: CsvParserRow<CsvEnum>,
  ) => { [key: string]: any };
}
