import { parse } from 'csv-parse';
import { BadRequestException } from '@nestjs/common';
import { CsvParserHeaderEnum } from './enums';
import { CsvParserOptions } from './interfaces';
import { CsvParserRow } from './types';
import { CsvParserValidationError } from './csv-parser-validation-error.util';

export class CsvParser<CsvEnum extends CsvParserHeaderEnum> {
  constructor(private options: CsvParserOptions<CsvEnum>) {}

  public async parse(
    file: Express.Multer.File,
  ): Promise<{ [key: string]: any }[]> {
    const csv = await this.readFile(file);
    const allColumns = Object.values(this.options.header);
    const allColumnKeys = Object.keys(this.options.header);

    const header = csv.shift();

    if (!header.every((col) => allColumns.includes(col))) {
      throw new BadRequestException('Invalid CSV header');
    }

    const rawData = csv.map((row) =>
      row.reduce((acc, value, index) => {
        const columnKey = allColumnKeys[index];
        const transformFunc =
          this.options.validator[columnKey].transform ?? ((data) => data);
        return { ...acc, [columnKey]: transformFunc(value) };
      }, {} as CsvParserRow<CsvEnum>),
    );

    for (const [index, row] of rawData.entries()) {
      for (const column in row) {
        const hasPayload =
          this.options.validator[column].hasPayload ?? (() => true);

        if (hasPayload(row[column], row)) {
          const validated = this.options.validator[column].validate(
            row[column],
            row,
          );

          if (!validated)
            throw new CsvParserValidationError(
              index + 2,
              this.options.header[column],
            );
        }
      }
    }

    return rawData.map((row) =>
      Object.keys(row)
        .map((column) => {
          const hasPayload =
            this.options.validator[column].hasPayload ?? (() => true);
          if (hasPayload(row[column], row)) {
            return this.options.validator[column].preparePayload(
              row[column],
              row,
            );
          }
        })
        .filter((payload) => typeof payload !== 'undefined')
        .reduce((acc, value) => ({ ...acc, ...value }), {}),
    );
  }

  public stringify(values: Partial<CsvParserRow<CsvEnum>>[]): string {
    const header = Object.values(this.options.header).join(
      this.options.delimiter,
    );

    const allColumnKeys = Object.keys(this.options.header);
    const rows = values.map((value) =>
      allColumnKeys
        .map((column) => {
          const result = value[column] ?? '';
          if (typeof result === 'string') return result;
          if (typeof result['toString'] === 'function') {
            return result['toString']();
          }
          return result;
        })
        .join(','),
    );

    return [header, ...rows].join('\n');
  }

  private async readFile(file: Express.Multer.File): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const records: string[][] = [];
      const parser = parse(file.buffer, {
        delimiter: this.options.delimiter,
      });

      parser.on('readable', function () {
        let record: string[];
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });

      parser.on('error', () => {
        reject(new BadRequestException('Failed to load file'));
      });

      parser.on('end', function () {
        resolve(records);
      });
    });
  }
}
