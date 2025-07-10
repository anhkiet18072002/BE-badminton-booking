import { Injectable } from '@nestjs/common';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourtService extends BaseService {
  defaultSelect: Prisma.CourtSelect = {
    ...baseSelect,
    name: true,
    location: true,
    bookings: {
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            lastName: true,
            firstName: true,
            middleName: true,
          },
        },
        type: true,
        date: true,
        startTime: true,
        endTime: true,
      },
    },
  };
  defaultSearchFields?: string[] | undefined;

  constructor(private readonly prisma: PrismaService) {
    super(prisma.court);
  }
}
