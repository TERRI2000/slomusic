import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Track } from '../tracks/track.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ length: 7, default: '#FA243C' })
  color: string; // hex color, mirrors UI

  @Column({ type: 'text', nullable: true })
  coverUrl: string | null;

  // ── Owner ──────────────────────────────────────────────────────────
  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  // ── Tracks (many-to-many) ──────────────────────────────────────────
  @ManyToMany(() => Track, { eager: true, cascade: false })
  @JoinTable({
    name: 'playlist_tracks', // junction table name
    joinColumn: { name: 'playlistId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trackId', referencedColumnName: 'id' },
  })
  tracks: Track[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
