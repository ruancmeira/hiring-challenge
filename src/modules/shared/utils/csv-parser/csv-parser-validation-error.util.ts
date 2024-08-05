export class CsvParserValidationError extends Error {
  constructor(public readonly row: number, public readonly column: string) {
    super(
      "Ocorreu um erro ao importar a planilha. Verifique o preenchimento da coluna '{column}' na linha {row}.",
    );
  }
}
