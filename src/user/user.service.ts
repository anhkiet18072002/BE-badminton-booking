import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService extends BaseService {
  defaultSelect: Prisma.UserSelect = {
    ...baseSelect,
    firstName: true,
    lastName: true,
    middleName: true,
    account: {
      select: {
        id: true,
        email: true,
        username: true,
      },
    },
    bookings: {
      select: {
        type: true,
        date: true,
        startTime: true,
        endTime: true,
        courtId: true,
        court: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    },
  };
  defaultSearchFields?: string[] | undefined;

  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  async booking_court(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
    if (!user) {
      throw new BadRequestException(
        `The user with ID: ${id} does not exist or has been removed`,
      );
    }
    if (dto.bookings && dto.bookings.length > 0) {
      for (const booking of dto.bookings) {
        const courtIds = Array.isArray(booking.courtId)
          ? booking.courtId
          : [booking.courtId];

        for (const courtId of courtIds) {
          const court = await this.prisma.court.findUnique({
            where: { id: courtId },
          });
          if (!court) {
            throw new BadRequestException(
              `The court with id: ${courtId} does not exist or has been removed`,
            );
          }

          const conflict = await this.prisma.booking.findFirst({
            where: {
              courtId,
              date: booking.date,
              NOT: { userId: id },
              startTime: { lt: booking.endTime },
              endTime: { gt: booking.startTime },
            },
          });

          if (conflict) {
            throw new BadRequestException(
              `Court ${court.name} is already booked on ${booking.date} from ${booking.startTime} to ${booking.endTime}`,
            );
          }
        }
      }
    }

    if (!dto.bookings) {
      await this.prisma.booking.deleteMany({
        where: { userId: id },
      });
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.bookings && {
          bookings: {
            deleteMany: {},
            createMany: {
              data: dto.bookings,
            },
          },
        }),
      },
      select: this.defaultSelect,
    });
  }
}
