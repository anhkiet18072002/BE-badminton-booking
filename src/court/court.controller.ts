import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { Swagger } from 'src/core/common/decorator/swagger/swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { QueryCourtDto } from './dto/query-role.dto';

@Swagger('Courts')
@Controller('courts')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @ApiOperation({ summary: 'Create a new court' })
  @Post()
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtService.create(createCourtDto);
  }

  @ApiOperation({ summary: 'Get all courts' })
  @Get()
  findAll(@Query() query: QueryCourtDto) {
    return this.courtService.findAll(query);
  }

  @ApiOperation({ summary: 'Get court by its ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtService.findOne(id);
  }

  @ApiOperation({ summary: 'Update court by its ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourtDto: UpdateCourtDto) {
    return this.courtService.update(id, updateCourtDto);
  }

  @ApiOperation({ summary: 'Delete court by its ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courtService.remove(id);
  }
}
