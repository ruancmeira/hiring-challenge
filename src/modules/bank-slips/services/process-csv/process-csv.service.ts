import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ProcessCsvParams } from './interfaces';
import { CreateManyBankSlipParams } from '@modules/bank-slips/services/create-many/interfaces';
import { CsvHeader } from './enums';
import { bodyValidator, headerMapper } from './constants';

import { PrismaService } from '@modules/prisma/services/prisma.service';
import { CreateManyBankSlipService } from '@modules/bank-slips/services/create-many/create-many.service';

import { CsvParser } from '@modules/shared/utils';

@Injectable()
export class ProcessCsvService {
  private readonly parser: CsvParser<typeof CsvHeader>;

  public constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(CreateManyBankSlipService)
    private readonly createManyBankSlipService: CreateManyBankSlipService,
  ) {
    this.parser = new CsvParser({
      header: headerMapper,
      validator: bodyValidator,
      delimiter: ',',
    });
  }

  async execute({ file, page, amount }: ProcessCsvParams): Promise<void> {
    try {
      const paginatedBankSlips = await this.parseAndGetPaginatedBankSlips({
        file,
        page,
        amount,
      });

      const bankSlips = await this.prisma.bankSlip.findMany({
        where: {
          debtId: {
            in: paginatedBankSlips.map(
              (paginatedBankSlip) => paginatedBankSlip.debtId,
            ),
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      const bankSlipsToCreate = paginatedBankSlips
        .map((paginatedBankSlip) => {
          const existingUuid = bankSlips.some(
            (bankSlip) => bankSlip.debtId === paginatedBankSlip.debtId,
          );

          if (!existingUuid) return paginatedBankSlip;
        })
        .filter(Boolean);

      if (!bankSlipsToCreate?.length)
        throw new BadRequestException(
          'All bank slips sent have already been processed previously',
        );

      await this.createManyBankSlipService.execute(bankSlipsToCreate);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error?.message);
      } else {
        throw new InternalServerErrorException(
          'There is a problem, please contact the administrators',
        );
      }
    }
  }

  private async parseAndGetPaginatedBankSlips({
    file,
    page,
    amount,
  }: ProcessCsvParams): Promise<CreateManyBankSlipParams[]> {
    const allBankSlipsParsed: CreateManyBankSlipParams[] =
      await this.parser.parse(file);

    if (!allBankSlipsParsed?.length)
      throw new BadRequestException(
        'Requires at least one bank slip for processing',
      );

    const startIndex = (page - 1) * amount;
    const endIndex = startIndex + amount;

    return allBankSlipsParsed?.slice(startIndex, endIndex);
  }
}
