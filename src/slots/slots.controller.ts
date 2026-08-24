import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { Slot } from '../generated/prisma/client.js';
import { GetSlotsDto } from './dto/get-slots.dto.js';
import { BookSlotDto } from './dto/book-slot.dto.js';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createSlotDto: CreateSlotDto): Promise<Slot> {
    return this.slotsService.create(createSlotDto);
  }

  @Get('free')
  getSlots(@Query() getSlotsDto: GetSlotsDto): Promise<Slot[]> {
    return this.slotsService.getFree(getSlotsDto);
  }

  @Post(':id/book')
  book(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bookSlotDto: BookSlotDto,
  ): Promise<Slot | null> {
    return this.slotsService.book(id, bookSlotDto);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  unbook(@Param('id', ParseUUIDPipe) id: string): Promise<Slot | null> {
    return this.slotsService.cancel(id);
  }
}
