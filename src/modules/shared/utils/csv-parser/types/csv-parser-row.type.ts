import { CsvParserHeaderEnum } from '../enums';

export type CsvParserRow<CsvEnum extends CsvParserHeaderEnum> = {
  [key in keyof CsvEnum]: any;
};
