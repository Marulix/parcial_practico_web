import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from 'src/album/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,

    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,

  ) { }

  async findAll(): Promise<TrackEntity[]> {
    return await this.trackRepository.find({ relations: ['albums'] });
  }

  async findOne(id: string): Promise<TrackEntity> {
    const Track: TrackEntity = await this.trackRepository.findOne({ where: { id }, relations: ["albums"] });
    if (!Track)
      throw new BusinessLogicException("The Track with the given id was not found", BusinessError.NOT_FOUND);

    return Track;
  }

  async create(AlbumId: string, track: TrackEntity): Promise<TrackEntity> {
    const album = await this.albumRepository.findOne({ where: { id: AlbumId } });
    if (!album)
      throw new BusinessLogicException("The Album with the given id was not found", BusinessError.NOT_FOUND);
    
    if (track.duration <= 0)
      throw new BusinessLogicException("The Track duration must be greater than zero", BusinessError.BAD_REQUEST);
    
    album.tracks = [...album.tracks, track];
    await this.albumRepository.save(album);
    return await this.trackRepository.save(track);
  }

  async update(id: string, Track: TrackEntity): Promise<TrackEntity> {
    const persistedTrack: TrackEntity = await this.trackRepository.findOne({ where: { id } });
    if (!persistedTrack)
      throw new BusinessLogicException("The Track with the given id was not found", BusinessError.NOT_FOUND);

    Track.id = id;

    return await this.trackRepository.save(Track);
  }

  async delete(id: string) {
    const Track: TrackEntity = await this.trackRepository.findOne({ where: { id } });
    if (!Track)
      throw new BusinessLogicException("The Track with the given id was not found", BusinessError.NOT_FOUND);

    await this.trackRepository.remove(Track);
  }
}
