import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { amountDefault, pageDefault } from '../constants';

export class ProcessCsvDTO {
  @ApiProperty()
  @IsNumber()
  @Min(pageDefault)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiProperty()
  @IsNumber()
  @Min(pageDefault)
  @Max(amountDefault)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  amount?: number;
}
