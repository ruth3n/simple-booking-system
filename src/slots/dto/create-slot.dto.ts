import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateSlotDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
