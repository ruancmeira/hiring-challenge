import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@modules/prisma/services/prisma.service';
import { CreateManyBankSlipService } from './create-many.service';
import { PDFProvider, EmailProvider } from '@modules/shared/providers';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// TODO: não consegui configurar o shadow db pra rodar os testes de integração

dotenv.config({ path: '.env' });

describe('CreateManyBankSlipService - [Integration Tests]', () => {
  let service: CreateManyBankSlipService;
  let prisma: PrismaService;
  let pdfProvider: PDFProvider;
  let emailProvider: EmailProvider;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    prismaClient = new PrismaClient();
    await prismaClient.$connect();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateManyBankSlipService,
        PrismaService,
        {
          provide: PDFProvider,
          useValue: {
            generateBankSlip: jest
              .fn()
              .mockResolvedValue(Buffer.from('pdf data')),
          },
        },
        {
          provide: EmailProvider,
          useValue: {
            send: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<CreateManyBankSlipService>(CreateManyBankSlipService);
    prisma = module.get<PrismaService>(PrismaService);
    pdfProvider = module.get<PDFProvider>(PDFProvider);
    emailProvider = module.get<EmailProvider>(EmailProvider);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaClient.bankSlip.deleteMany({});
  });

  it('should create bank slips and send emails successfully', async () => {
    const bankSlipsToCreate = [
      {
        debtId: '1',
        debtDueDate: new Date().toISOString(),
        debtAmount: '100.0',
        email: 'test@example.com',
        governmentId: '12454',
        name: 'John Doe',
      },
    ];

    await service.execute(bankSlipsToCreate);

    const createdBankSlips = await prismaClient.bankSlip.findMany();

    expect(createdBankSlips).toHaveLength(1);
    expect(createdBankSlips[0].name).toEqual('John Doe');
    expect(createdBankSlips[0].debtAmount.toNumber()).toEqual(100.0);

    expect(emailProvider.send).toHaveBeenCalled();
  });

  it('should handle empty input', async () => {
    await service.execute([]);

    const createdBankSlips = await prismaClient.bankSlip.findMany();
    expect(createdBankSlips).toHaveLength(0);
  });
});
