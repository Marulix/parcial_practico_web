import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) { }

  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find({ relations: ['tracks'] });
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const Album: AlbumEntity = await this.albumRepository.findOne({ where: { id }, relations: ["tracks"] });
    if (!Album)
      throw new BusinessLogicException("The Album with the given id was not found", BusinessError.NOT_FOUND);

    return Album;
  }

  async create(Album: AlbumEntity): Promise<AlbumEntity> {
    if (Album.name === "")
      throw new BusinessLogicException("The Album name cannot be empty", BusinessError.BAD_REQUEST);
    if (Album.description === "")
      throw new BusinessLogicException("The Album description cannot be empty", BusinessError.BAD_REQUEST);
    return await this.albumRepository.save(Album);
  }

  async update(id: string, Album: AlbumEntity): Promise<AlbumEntity> {
    const persistedAlbum: AlbumEntity = await this.albumRepository.findOne({ where: { id } });
    if (!persistedAlbum)
      throw new BusinessLogicException("The Album with the given id was not found", BusinessError.NOT_FOUND);

    Album.id = id;

    return await this.albumRepository.save(Album);
  }

  async delete(id: string) {
    const Album: AlbumEntity = await this.albumRepository.findOne({ where: { id } });
    if (!Album)
      throw new BusinessLogicException("The Album with the given id was not found", BusinessError.NOT_FOUND);

    const AlbumTracks = Album.tracks;
    if (AlbumTracks.length > 0)
      throw new BusinessLogicException("The Album cannot be deleted because it has tracks", BusinessError.BAD_REQUEST);
    await this.albumRepository.remove(Album);
  }
}
