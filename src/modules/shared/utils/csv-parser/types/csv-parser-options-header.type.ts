import { CsvParserHeaderEnum } from '../enums';

export type CsvParserOptionsHeader<CsvEnum extends CsvParserHeaderEnum> = {
  [key in keyof CsvEnum]: string;
};
