import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  findAll(): Promise<Track[]> {
    return this.trackRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) throw new NotFoundException(`Track #${id} not found`);
    return track;
  }

  create(dto: CreateTrackDto): Promise<Track> {
    const track = this.trackRepository.create(dto);
    return this.trackRepository.save(track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id); // throws if not found
    Object.assign(track, dto);
    return this.trackRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id); // throws if not found
    await this.trackRepository.remove(track);
  }
}
