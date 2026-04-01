import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Track } from '../tracks/track.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  // ── Read (public) ──────────────────────────────────────────────────

  findAll(): Promise<Playlist[]> {
    return this.playlistRepository.find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!playlist) throw new NotFoundException(`Playlist #${id} not found`);
    return playlist;
  }

  findByOwner(ownerId: string): Promise<Playlist[]> {
    return this.playlistRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  // ── Write (owner only — guard enforced in controller) ──────────────

  create(dto: CreatePlaylistDto, ownerId: string): Promise<Playlist> {
    const playlist = this.playlistRepository.create({
      ...dto,
      ownerId,
      tracks: [],
    });
    return this.playlistRepository.save(playlist);
  }

  async update(
    id: string,
    dto: UpdatePlaylistDto,
    requesterId: string,
  ): Promise<Playlist> {
    const playlist = await this.findOne(id);
    this.assertOwner(playlist, requesterId);
    Object.assign(playlist, dto);
    return this.playlistRepository.save(playlist);
  }

  async remove(id: string, requesterId: string): Promise<void> {
    const playlist = await this.findOne(id);
    this.assertOwner(playlist, requesterId);
    await this.playlistRepository.remove(playlist);
  }

  // ── Track management ───────────────────────────────────────────────

  async addTrack(
    playlistId: string,
    trackId: string,
    requesterId: string,
  ): Promise<Playlist> {
    const playlist = await this.findOne(playlistId);
    this.assertOwner(playlist, requesterId);

    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });
    if (!track) throw new NotFoundException(`Track #${trackId} not found`);

    const alreadyAdded = playlist.tracks.some((t) => t.id === trackId);
    if (!alreadyAdded) {
      playlist.tracks.push(track);
      await this.playlistRepository.save(playlist);
    }

    return playlist;
  }

  async removeTrack(
    playlistId: string,
    trackId: string,
    requesterId: string,
  ): Promise<Playlist> {
    const playlist = await this.findOne(playlistId);
    this.assertOwner(playlist, requesterId);

    playlist.tracks = playlist.tracks.filter((t) => t.id !== trackId);
    return this.playlistRepository.save(playlist);
  }

  async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    const playlist = await this.findOne(playlistId);
    return playlist.tracks;
  }

  // ── Private helper ─────────────────────────────────────────────────

  private assertOwner(playlist: Playlist, requesterId: string): void {
    if (playlist.ownerId !== requesterId) {
      throw new ForbiddenException('You do not own this playlist');
    }
  }
}
