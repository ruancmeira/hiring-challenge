import { Test, TestingModule } from '@nestjs/testing';
import { ProcessCsvService } from '@modules/bank-slips/services/process-csv/process-csv.service';
import { PrismaService } from '@modules/prisma/services/prisma.service';
import { CreateManyBankSlipService } from '@modules/bank-slips/services/create-many/create-many.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CsvParser } from '@modules/shared/utils';
import { ProcessCsvParams } from './interfaces';
import { CsvHeader } from './enums';
import {
  bankSlipsToCreateMock,
  bankSlipToCreateMock,
} from '../create-many/mocks';
import { BankSlip } from '@prisma/client';

describe('ProcessCsvService - [Unit Tests]', () => {
  let processCsvService: ProcessCsvService;
  let prismaService: PrismaService;
  let createManyBankSlipService: CreateManyBankSlipService;
  let csvParser: jest.Mocked<CsvParser<typeof CsvHeader>>;

  beforeEach(async () => {
    csvParser = {
      parse: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessCsvService,
        {
          provide: PrismaService,
          useValue: {
            bankSlip: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: CreateManyBankSlipService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CsvParser,
          useValue: csvParser,
        },
      ],
    }).compile();

    processCsvService = module.get<ProcessCsvService>(ProcessCsvService);
    prismaService = module.get<PrismaService>(PrismaService);
    createManyBankSlipService = module.get<CreateManyBankSlipService>(
      CreateManyBankSlipService,
    );
  });

  describe('execute', () => {
    it('should all services be defined', () => {
      expect(processCsvService).toBeDefined();
      expect(prismaService).toBeDefined();
      expect(createManyBankSlipService).toBeDefined();
    });

    it('should throw BadRequestException if no bank slips are parsed', async () => {
      const file = {
        buffer: Buffer.from(
          'name,governmentId,email,debtAmount,debtDueDate,debtId',
        ),
      } as Express.Multer.File;
      const data: ProcessCsvParams = { file, page: 1, amount: 10 };

      csvParser.parse.mockResolvedValue([]);

      await expect(processCsvService.execute(data)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await processCsvService.execute(data);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Requires at least one bank slip for processing',
        );
      }
    });

    it('should throw BadRequestException if csv has a invalid header', async () => {
      const file = {
        buffer: Buffer.from('a,b,c,d,e,f,g'),
      } as Express.Multer.File;
      const data: ProcessCsvParams = { file, page: 1, amount: 10 };

      csvParser.parse.mockResolvedValue([]);

      await expect(processCsvService.execute(data)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await processCsvService.execute(data);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid CSV header');
      }
    });

    it('should throw BadRequestException if all bank slips are already processed', async () => {
      const file = {
        buffer: Buffer.from(
          'name,governmentId,email,debtAmount,debtDueDate,debtId\nTest Slip, 123456789, test@example.com, 100.12, 2024-08-01, 1',
        ),
      } as Express.Multer.File;
      const data: ProcessCsvParams = { file, page: 1, amount: 10 };

      const createdBankSlipMock: BankSlip = {
        id: 1,
        ...bankSlipToCreateMock,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.bankSlip, 'findMany')
        .mockResolvedValue([createdBankSlipMock]);

      csvParser.parse.mockResolvedValue(bankSlipsToCreateMock);

      try {
        await processCsvService.execute(data);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'All bank slips sent have already been processed previously',
        );
      }
    });

    it('should call createManyBankSlipService.execute with correct data', async () => {
      const file = {
        buffer: Buffer.from(
          'name,governmentId,email,debtAmount,debtDueDate,debtId\nTest Slip, 123456789, test@example.com, 100.12, 2024-08-01, 1',
        ),
      } as Express.Multer.File;
      const data: ProcessCsvParams = { file, page: 1, amount: 10 };

      jest.spyOn(prismaService.bankSlip, 'findMany').mockResolvedValue([]);

      csvParser.parse.mockResolvedValue(bankSlipsToCreateMock);

      await processCsvService.execute(data);

      expect(prismaService.bankSlip.findMany).toBeCalledTimes(1);
      expect(createManyBankSlipService.execute).toBeCalledTimes(1);
    });

    it('should throw InternalServerErrorException on unexpected errors', async () => {
      const file = { buffer: Buffer.from('') } as Express.Multer.File;
      const data: ProcessCsvParams = { file, page: 1, amount: 10 };

      csvParser.parse.mockRejectedValue(new Error('Unexpected error'));

      await expect(processCsvService.execute(data)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
