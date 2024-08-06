import { Test, TestingModule } from '@nestjs/testing';
import { BankSlipsController } from '@modules/bank-slips/controllers/bank-slips.controller';
import { ProcessCsvService } from '@modules/bank-slips/services/process-csv/process-csv.service';
import { ProcessCsvDTO } from '@modules/bank-slips/dtos';
import { BadRequestException } from '@nestjs/common';

describe('BankSlipsController', () => {
  let controller: BankSlipsController;
  let processCsvService: ProcessCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankSlipsController],
      providers: [
        {
          provide: ProcessCsvService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BankSlipsController>(BankSlipsController);
    processCsvService = module.get<ProcessCsvService>(ProcessCsvService);
  });

  describe('processCsv', () => {
    it('should process CSV file and call processCsvService.execute', async () => {
      const file = {
        originalname: 'test.csv',
        mimetype: 'text/csv',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const data: ProcessCsvDTO = { page: 1, amount: 10 };

      jest.spyOn(processCsvService, 'execute').mockResolvedValue(undefined);

      await controller.processCsv(file, data);

      expect(processCsvService.execute).toHaveBeenCalledWith({
        file,
        page: 1,
        amount: 10,
      });
    });

    it('should throw BadRequestException if no file is provided', async () => {
      const data: ProcessCsvDTO = { page: 1, amount: 10 };

      try {
        await controller.processCsv(null as any, data);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('File is required');
      }
    });

    it('should throw BadRequestException if file format is invalid', async () => {
      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const data: ProcessCsvDTO = { page: 1, amount: 10 };

      try {
        await controller.processCsv(file, data);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid file format');
      }
    });
  });
});
