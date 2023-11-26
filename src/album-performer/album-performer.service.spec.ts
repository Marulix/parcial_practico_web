/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumPerformerService } from './album-performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    performerRepository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerAlbum should add an performer to a album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      name: faker.lorem.word(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(),
      albums: [],
    });

    const newAlbum: AlbumEntity = await albumRepository.save({
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph(),
      performers: [],
    });

    const result: AlbumEntity = await service.addPerformerToAlbum(
      newAlbum.id,
      newPerformer.id,
    );

    expect(result.performers.length).toBe(1);
    expect(result.performers[0]).not.toBeNull();
    expect(result.performers[0].name).toBe(newPerformer.name);
    expect(result.performers[0].image).toBe(newPerformer.image);
    expect(result.performers[0].description).toBe(newPerformer.description);
  });

  it('addPerformerAlbum should thrown exception for an invalid performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph(),
      performers: [],
    });

    await expect(() =>
      service.addPerformerToAlbum(newAlbum.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });

  it('addPerformerAlbum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      name: faker.lorem.word(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(),
      albums: [],
    });

    await expect(() =>
      service.addPerformerToAlbum('0', newPerformer.id),
    ).rejects.toHaveProperty(
      'message',
      'The album with the given id was not found',
    );
  });
});
