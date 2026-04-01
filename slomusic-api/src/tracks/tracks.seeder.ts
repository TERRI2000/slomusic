import { DataSource } from 'typeorm';
import { Track } from './track.entity';

export async function seedTracks(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Track);
  const existing = await repo.count();
  if (existing > 0) {
    console.log('⏭  Tracks already seeded, skipping.');
    return;
  }

  const tracks = repo.create([
    {
      title: 'Midnight Code',
      artist: 'MaxVibe',
      duration: 200,
      color: '#FA243C',
      coverUrl:
        'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      title: 'Neon Dreams',
      artist: 'MaxVibe',
      duration: 225,
      color: '#AF52DE',
      coverUrl:
        'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      title: 'Lo-Fi Session',
      artist: 'Chillhop',
      duration: 242,
      color: '#0A84FF',
      coverUrl:
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
      title: 'Dark Pixels',
      artist: 'MaxVibe',
      duration: 190,
      color: '#30D158',
      coverUrl:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
    {
      title: 'Cloud Nine',
      artist: 'SynthWave',
      duration: 178,
      color: '#FF9F0A',
      coverUrl:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    },
  ]);

  await repo.save(tracks);
  console.log('✅ Tracks seeded successfully.');
}
