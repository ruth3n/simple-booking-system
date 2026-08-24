import { IsDateString, IsOptional } from 'class-validator';

export class GetSlotsDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
