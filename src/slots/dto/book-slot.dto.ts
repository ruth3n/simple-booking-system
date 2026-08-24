import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BookSlotDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsEmail()
  clientEmail: string;
}
