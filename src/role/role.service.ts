import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBaseDto } from 'src/core/dto/update-base.dto';

@Injectable()
export class RoleService extends BaseService {
  defaultSelect: Prisma.RoleSelect = {
    ...baseSelect,
    name: true,
    description: true,
    key: true,
    rolePermissions: {
      select: {
        permission: {
          select: { id: true, key: true },
        },
      },
    },
  };
  defaultSearchFields?: string[] | undefined;

  constructor(private readonly prisma: PrismaService) {
    super(prisma.role);
  }

  override async create(dto: CreateRoleDto): Promise<any> {
    if (dto.rolePermissions && dto.rolePermissions.length > 0) {
      for (const pa of dto.rolePermissions || []) {
        const permissionIds = Array.isArray(pa.permissionId)
          ? pa.permissionId
          : [pa.permissionId];
        for (const permissionId of permissionIds) {
          const permission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
          });
          if (!permission) {
            throw new BadRequestException(
              `The permission with id: ${permissionId} does not exist or has been removed`,
            );
          }
        }
      }
    }

    const role = await this.prisma.role.create({
      data: {
        name: dto.name,
        key: dto.key,
        description: dto.description,
        ...(dto.rolePermissions && {
          rolePermissions: {
            createMany: {
              data: dto.rolePermissions,
            },
          },
        }),
      },
      select: this.defaultSelect,
    });

    return role;
  }

  override async update(id: string, dto: UpdateRoleDto): Promise<any> {
    const role = await this.prisma.role.findUnique({
      where: { id },

      select: this.defaultSelect,
    });
    if (!role) {
      throw new BadRequestException(
        `The role with ID: ${id} does not exist or has been removed`,
      );
    }

    if (dto.rolePermissions && dto.rolePermissions.length > 0) {
      for (const pa of dto.rolePermissions || []) {
        const permissionIds = Array.isArray(pa.permissionId)
          ? pa.permissionId
          : [pa.permissionId];
        for (const permissionId of permissionIds) {
          const permission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
          });
          if (!permission) {
            throw new BadRequestException(
              `The permission with id: ${permissionId} does not exist or has been removed`,
            );
          }
        }
      }
    }

    if (!dto.rolePermissions) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    }

    return await this.prisma.role.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        key: dto.key,
        ...(dto.rolePermissions && {
          rolePermissions: {
            deleteMany: {},
            createMany: {
              data: dto.rolePermissions,
            },
          },
        }),
      },
    });
  }
}
