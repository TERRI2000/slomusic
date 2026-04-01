import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';
import { Track } from '../tracks/track.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddTrackDto } from './dto/add-track.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  // ── Public routes ──────────────────────────────────────────────────

  @Get()
  findAll(): Promise<Playlist[]> {
    return this.playlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Playlist> {
    return this.playlistsService.findOne(id);
  }

  @Get(':id/tracks')
  getPlaylistTracks(@Param('id') id: string): Promise<Track[]> {
    return this.playlistsService.getPlaylistTracks(id);
  }

  // ── Protected routes (must be logged in) ──────────────────────────

  @Get('user/me')
  @UseGuards(JwtAccessGuard)
  findMine(@CurrentUser() user: User): Promise<Playlist[]> {
    return this.playlistsService.findByOwner(user.id);
  }

  @Post()
  @UseGuards(JwtAccessGuard)
  create(
    @Body() dto: CreatePlaylistDto,
    @CurrentUser() user: User,
  ): Promise<Playlist> {
    return this.playlistsService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
    @CurrentUser() user: User,
  ): Promise<Playlist> {
    return this.playlistsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.playlistsService.remove(id, user.id);
  }

  // ── Track management (owner only) ─────────────────────────────────

  @Post(':id/tracks')
  @UseGuards(JwtAccessGuard)
  addTrack(
    @Param('id') id: string,
    @Body() dto: AddTrackDto,
    @CurrentUser() user: User,
  ): Promise<Playlist> {
    return this.playlistsService.addTrack(id, dto.trackId, user.id);
  }

  @Delete(':id/tracks/:trackId')
  @UseGuards(JwtAccessGuard)
  removeTrack(
    @Param('id') id: string,
    @Param('trackId') trackId: string,
    @CurrentUser() user: User,
  ): Promise<Playlist> {
    return this.playlistsService.removeTrack(id, trackId, user.id);
  }
}
