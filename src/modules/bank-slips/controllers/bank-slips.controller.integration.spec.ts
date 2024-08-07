import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { BankSlipsController } from '@modules/bank-slips/controllers/bank-slips.controller';
import { ProcessCsvService } from '@modules/bank-slips/services/process-csv/process-csv.service';
import * as dotenv from 'dotenv';

// TODO: não consegui configurar o shadow db pra rodar os testes de integração

dotenv.config({ path: '.env' });

describe('BankSlipsController - [Integration Tests]', () => {
  let app: INestApplication;
  let processCsvService: ProcessCsvService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BankSlipsController],
      providers: [
        {
          provide: ProcessCsvService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    processCsvService = moduleFixture.get<ProcessCsvService>(ProcessCsvService);
    await app.listen(process.env.INTEGRATION_TEST_PORT || 3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should process the CSV file successfully', async () => {
    console.log(app.getHttpServer());

    await request(app.getHttpServer())
      .post('/bank-slips/process-csv')
      .attach(
        'file',
        Buffer.from('name,amount\nJohn Doe,123\n'),
        'testfile.csv',
      )
      .field('page', 1)
      .field('amount', 10)
      .expect(HttpStatus.OK);

    expect(processCsvService.execute).toHaveBeenCalledWith({
      file: expect.any(Object),
      page: 1,
      amount: 10,
    });
  });

  it('should return 400 if file is missing', async () => {
    await request(app.getHttpServer())
      .post('/bank-slips/process-csv')
      .field('page', 1)
      .field('amount', 10)
      .expect(HttpStatus.BAD_REQUEST, {
        statusCode: 400,
        message: 'File is required',
        error: 'Bad Request',
      });
  });

  it('should return 400 if file is not a CSV', async () => {
    await request(app.getHttpServer())
      .post('/bank-slips/process-csv')
      .attach('file', Buffer.from('some text'), 'testfile.txt')
      .field('page', 1)
      .field('amount', 10)
      .expect(HttpStatus.BAD_REQUEST, {
        statusCode: 400,
        message: 'Invalid file format',
        error: 'Bad Request',
      });
  });
});
