import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ProcessCsvService } from '@modules/bank-slips/services/process-csv/process-csv.service';
import { ProcessCsvDTO } from '@modules/bank-slips/dtos';
import { amountDefault, pageDefault } from '../constants';

@ApiTags('Boletos bancários')
@Controller({
  path: 'bank-slips',
  version: '1',
})
export class BankSlipsController {
  constructor(private readonly processCsvService: ProcessCsvService) {}

  @Post('procces-csv')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Processa um CSV de acordo com o modelo, gera os boletos e envia para os e-mails.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          default: pageDefault,
        },
        amount: {
          type: 'number',
          default: amountDefault,
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      'Boletos gerados e enviados por e-mail, CSV processado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros inválidos.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.includes('csv')) {
          cb(new BadRequestException('Invalid file format'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async processCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: ProcessCsvDTO,
  ): Promise<void> {
    if (!file) throw new BadRequestException('File is required');

    const { page, amount } = data;

    return await this.processCsvService.execute({ file, page, amount });
  }
}
