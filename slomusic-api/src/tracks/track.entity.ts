import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  artist: string;

  @Column({ type: 'int' })
  duration: number; // seconds

  @Column({ length: 7, default: '#FA243C' })
  color: string; // hex color for UI theming

  @Column({ length: 500, nullable: true })
  coverUrl: string;

  @Column({ length: 500, nullable: true })
  audioUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
