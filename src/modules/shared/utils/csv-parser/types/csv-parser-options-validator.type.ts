import { CsvParserHeaderEnum } from '../enums';
import { CsvParserValidatorProps } from '../interfaces';

export type CsvParserOptionsValidator<CsvEnum extends CsvParserHeaderEnum> = {
  [key in keyof CsvEnum]: CsvParserValidatorProps<CsvEnum>;
};
