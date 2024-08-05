import { ProcessCsvDTO } from '@modules/bank-slips/dtos';
import { MulterFile } from '@modules/bank-slips/interfaces';
import { Readable } from 'stream';

export const dataMock: ProcessCsvDTO = {
  amount: 5000,
  page: 1,
};

export const multerFileMock = (): MulterFile => {
  const buffer = Buffer.from('');
  const readableStream = new Readable();
  readableStream.push(buffer);
  readableStream.push(null);

  return {
    fieldname: 'file',
    originalname: 'test-file.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: buffer.length,
    stream: readableStream,
    destination: '',
    filename: '',
    path: '',
    buffer: buffer,
  } as MulterFile;
};
