export class CreateTrackDto {
  title: string;
  artist: string;
  duration: number;
  color?: string;
  coverUrl?: string;
  audioUrl?: string;
}
