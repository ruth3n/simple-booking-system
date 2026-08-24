import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { Prisma, Slot } from '../generated/prisma/client.js';
import { GetSlotsDto } from './dto/get-slots.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BookSlotDto } from './dto/book-slot.dto.js';

@Injectable()
export class SlotsService {
  constructor(private prisma: PrismaService) {}

  async create(query: CreateSlotDto): Promise<Slot> {
    const start = new Date(query.startTime);
    const end = new Date(query.endTime);
    const now = new Date();

    if (end <= start)
      throw new BadRequestException('endTime must be after startTime');

    if (start < now)
      throw new BadRequestException('Cannot create slot in the past');

    return this.prisma.slot.create({
      data: {
        title: query.title,
        start_time: start,
        end_time: end,
        is_booked: false,
      },
    });
  }

  async getFree(query: GetSlotsDto) {
    const whereCondition: Prisma.SlotWhereInput = {
      is_booked: false,
    };

    if (query.date) {
      const startDate = new Date(query.date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(query.date);
      endDate.setUTCHours(23, 59, 99, 999);

      whereCondition.start_time = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.slot.findMany({
      where: whereCondition,
      orderBy: {
        start_time: 'asc',
      },
    });
  }

  async book(id: string, query: BookSlotDto) {
    const updated = await this.prisma.slot.updateMany({
      where: {
        id,
        is_booked: false,
      },
      data: {
        client_name: query.clientName,
        client_email: query.clientEmail,
        is_booked: true,
      },
    });

    if (updated.count === 0) {
      const slot = await this.prisma.slot.findUnique({ where: { id } });
      if (!slot) throw new NotFoundException(`No slot with id ${id}`);
      throw new ConflictException(`Slot with id ${id} is already booked`);
    }

    return this.prisma.slot.findUnique({ where: { id } });
  }

  async cancel(id: string) {
    const updated = await this.prisma.slot.updateMany({
      where: {
        id,
        is_booked: true,
      },
      data: {
        client_name: null,
        client_email: null,
        is_booked: false,
      },
    });

    if (updated.count === 0) {
      const slot = await this.prisma.slot.findUnique({ where: { id } });
      if (!slot) {
        throw new NotFoundException(`No slot with id ${id}`);
      }
      throw new ConflictException(`Slot with id ${id} is not booked`);
    }

    return this.prisma.slot.findUnique({ where: { id } });
  }
}
