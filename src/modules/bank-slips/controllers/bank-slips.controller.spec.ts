import { PrismaService } from '@modules/prisma/services/prisma.service';
import { ProcessCsvService } from '../services/process-csv/process-csv.service';
import { BankSlipsController } from './bank-slips.controller';
import { CreateManyBankSlipService } from '../services/create-many/create-many.service';
import { EmailProvider, PDFProvider } from '@modules/shared/providers';
import { Test } from '@nestjs/testing';
import { dataMock, multerFileMock } from './mocks/process-csv.mock';

describe('BankSlipsController', () => {
  let bankSlipsController: BankSlipsController;
  let processCsvService: ProcessCsvService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BankSlipsController],
      providers: [
        PrismaService,
        PDFProvider,
        EmailProvider,
        CreateManyBankSlipService,
        ProcessCsvService,
      ],
    }).compile();

    bankSlipsController =
      moduleRef.get<BankSlipsController>(BankSlipsController);
    processCsvService = moduleRef.get<ProcessCsvService>(ProcessCsvService);
  });

  describe('processCsv', () => {
    it('should process bank slips of CSV', async () => {
      jest.spyOn(processCsvService, 'execute').mockImplementation(() => null);

      const fileMock = multerFileMock();
      expect(await bankSlipsController.processCsv(fileMock, dataMock)).toBe(
        null,
      );
    });
  });
});
