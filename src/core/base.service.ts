import { Prisma } from '@prisma/client';
import { CreateBaseDto } from './dto/crete-base.dto';
import { QueryBaseDto } from './dto/query-base.dto';
import { dot2object } from 'src/util/string.util';
import { UpdateBaseDto } from './dto/update-base.dto';
import { BadRequestException } from '@nestjs/common';

type BaseSelect = {
  id: boolean;
  createdAt: boolean;
  updatedAt: boolean;
};

export const baseSelect: BaseSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
};

export abstract class BaseService {
  abstract readonly defaultSelect: any;
  abstract readonly defaultSearchFields?: string[];

  private readonly fields: string[];

  constructor(private readonly _prismaDelegate: any) {
    this.fields = Object.keys(this._prismaDelegate.fields);
  }

  async create(dto: CreateBaseDto) {
    return await this._prismaDelegate.create({
      data: { ...dto },
      select: this.defaultSelect,
    });
  }

  async findAll(query?: QueryBaseDto, select?: Record<string, unknown>) {
    let take = parseInt(String(query?.limit)) || 10;
    if (take <= -1 || take > 1000) {
      take = 1000;
    }

    const skip = ((Math.abs(parseInt(String(query?.page))) || 1) - 1) * take;

    let orderBy: Record<string, string> = {
      createdAt: Prisma.SortOrder.desc,
    };

    if (query?.sort && query?.sort?.trim() !== '') {
      const field = query.sort.split('|')[0]?.trim();
      if (this.fields.includes(field)) {
        let by = query.sort.split('|')[1].trim();
        if (by === Prisma.SortOrder.desc || by === Prisma.SortOrder.asc) {
          orderBy = {
            [field]: by,
          };
        } else {
          by = Prisma.SortOrder.desc;
          orderBy = {
            [field]: by,
          };
        }
      }
    }

    const where = query?.search
      ? {
          OR:
            this.defaultSearchFields?.map((field: string) => {
              return dot2object(field, {
                contains: query?.search,
                mode: 'insensitive',
              });
            }) || [],
        }
      : {};

    const [result, count] = await Promise.all([
      this._prismaDelegate.findMany({
        where,
        select: select || this.defaultSelect,
        take,
        skip,
        orderBy,
      }),
      this._prismaDelegate.count({
        where,
      }),
    ]);

    return {
      data: result,
      meta: {
        page: parseInt(String(query?.page)) || 1,
        pageSize: take,
        total: count || 0,
      },
    };
  }

  async findOne(id: string) {
    return await this._prismaDelegate.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
  }

  async update(id: string, dto: UpdateBaseDto) {
    const entity = await this._prismaDelegate.findUnique({ where: { id } });
    if (!entity) {
      throw new BadRequestException(
        `The entity with ID: ${id} does not exist or has been removed`,
      );
    }

    return await this._prismaDelegate.update({
      where: {
        id,
      },
      data: this.prepareData(dto),
      select: this.defaultSelect,
    });
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new BadRequestException(
        `The entity with ID: ${id} does not exist or has been removed`,
      );
    }

    try {
      await this._prismaDelegate.delete({ where: { id } });
    } catch (err) {
      return false;
    }

    return this.response(true);
  }

  private prepareData(dto: CreateBaseDto | UpdateBaseDto) {
    const baseFields: string[] = ['id', 'createdAt', 'updatedAt'];

    const data: Record<string, any> = {};
    Object.entries(dto)?.forEach(([field, value]: [string, any]) => {
      if (this.fields.includes(field) && !baseFields.includes(field)) {
        data[field] = value;
      }
    });

    return data;
  }

  private response(result: any) {
    if (typeof result === 'object' || result?.data) {
      return result;
    }

    return { data: result };
  }
}
