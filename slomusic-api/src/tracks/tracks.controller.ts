import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';

@Controller('tracks')
@UseGuards(JwtAccessGuard) // 🔒 all routes require a valid access token
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTrackDto): Promise<Track> {
    return this.tracksService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto): Promise<Track> {
    return this.tracksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.tracksService.remove(id);
  }
}
