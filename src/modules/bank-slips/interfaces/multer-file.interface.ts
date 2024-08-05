export interface MulterFile extends Express.Multer.File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  encoding: string;
  fieldname: string;
}
