import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedTracks } from './tracks/tracks.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // allows your Expo app to call the API

  // Seed only in development
  if (process.env.NODE_ENV === 'development') {
    const dataSource = app.get(DataSource);
    await seedTracks(dataSource);
  }

  await app.listen(3001);
  console.log('🚀 SLOmusic API running on http://localhost:3000');
}
bootstrap();
