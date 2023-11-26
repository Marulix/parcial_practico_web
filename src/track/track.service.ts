import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { AlbumEntity } from '../album/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,

    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<TrackEntity[]> {
    return await this.trackRepository.find({ relations: ['album'] });
  }

  async findOne(id: string): Promise<TrackEntity> {
    const Track: TrackEntity = await this.trackRepository.findOne({
      where: { id },
      relations: ['album'],
    });
    if (!Track)
      throw new BusinessLogicException(
        'The Track with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return Track;
  }

  async create(AlbumId: string, track: TrackEntity): Promise<TrackEntity> {
    const album = await this.albumRepository.findOne({
      where: { id: AlbumId },
      relations: ['tracks'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The Album with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (track.duration <= 0)
      throw new BusinessLogicException(
        'The Track duration must be greater than zero',
        BusinessError.BAD_REQUEST,
      );

    await this.albumRepository.save(album);
    track.album = album;
    return await this.trackRepository.save(track);
  }
}
