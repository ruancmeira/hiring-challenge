import { CsvParserHeaderEnum } from '../enums';
import { CsvParserOptionsHeader, CsvParserOptionsValidator } from '../types';

export interface CsvParserOptions<CsvEnum extends CsvParserHeaderEnum> {
  header: CsvParserOptionsHeader<CsvEnum>;
  validator: CsvParserOptionsValidator<CsvEnum>;
  delimiter: ',' | ';';
}
