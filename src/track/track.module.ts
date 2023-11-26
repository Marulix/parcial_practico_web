import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { AlbumEntity } from 'src/album/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule { }
