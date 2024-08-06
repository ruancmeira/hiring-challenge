import { Test, TestingModule } from '@nestjs/testing';
import { CreateManyBankSlipService } from './create-many.service';
import { PrismaService } from '@modules/prisma/services/prisma.service';
import { EmailProvider, PDFProvider } from '@modules/shared/providers';
import { BankSlip } from '@prisma/client';
import {
  bankSlipsToCreateMock,
  bankSlipToCreateMock,
  manyBankSlipsToCreateMock,
} from './mocks';

describe('CreateManyBankSlipService', () => {
  let createManyBankSlipService: CreateManyBankSlipService;
  let prismaService: PrismaService;
  let pdfProvider: PDFProvider;
  let emailProvider: EmailProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateManyBankSlipService,
        {
          provide: PrismaService,
          useValue: {
            bankSlip: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: PDFProvider,
          useValue: {
            generateBankSlip: jest.fn(),
          },
        },
        {
          provide: EmailProvider,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    createManyBankSlipService = module.get<CreateManyBankSlipService>(
      CreateManyBankSlipService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
    pdfProvider = module.get<PDFProvider>(PDFProvider);
    emailProvider = module.get<EmailProvider>(EmailProvider);
  });

  describe('execute', () => {
    it('should all services be defined', () => {
      expect(createManyBankSlipService).toBeDefined();
      expect(prismaService).toBeDefined();
      expect(pdfProvider).toBeDefined();
      expect(emailProvider).toBeDefined();
    });

    it('should not call any methods if bankSlipsToCreate is empty', async () => {
      await createManyBankSlipService.execute([]);

      expect(prismaService.bankSlip.create).not.toHaveBeenCalled();
      expect(pdfProvider.generateBankSlip).not.toHaveBeenCalled();
      expect(emailProvider.send).not.toHaveBeenCalled();
    });

    it('should create one bankSlip, PDF generate and e-mail send', async () => {
      const createdBankSlipMock: BankSlip = {
        id: 1,
        ...bankSlipToCreateMock,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.bankSlip, 'create')
        .mockResolvedValue(createdBankSlipMock);

      jest
        .spyOn(pdfProvider, 'generateBankSlip')
        .mockResolvedValue(createdBankSlipMock);

      jest
        .spyOn(emailProvider, 'send')
        .mockResolvedValue([createdBankSlipMock]);

      const response = await createManyBankSlipService.execute(
        bankSlipsToCreateMock,
      );

      expect(prismaService.bankSlip.create).toHaveBeenCalledWith({
        data: {
          ...bankSlipToCreateMock,
        },
      });
      expect(pdfProvider.generateBankSlip).toHaveBeenCalledWith(
        createdBankSlipMock,
      );
      expect(emailProvider.send).toHaveBeenCalledWith(
        createdBankSlipMock,
        createdBankSlipMock,
      );
      expect(response).toEqual(undefined);
    });

    it('should create many bankSlips, PDF generate and e-mail send', async () => {
      const response = await createManyBankSlipService.execute(
        manyBankSlipsToCreateMock,
      );

      expect(prismaService.bankSlip.create).toBeCalledTimes(2);
      expect(pdfProvider.generateBankSlip).toBeCalledTimes(2);
      expect(emailProvider.send).toBeCalledTimes(2);
      expect(response).toEqual(undefined);
    });
  });
});
