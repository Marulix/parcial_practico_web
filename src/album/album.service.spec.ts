import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TrackEntity } from '../track/track.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let trackRepository: Repository<TrackEntity>;
  let albumsList: AlbumEntity[];
  let tracksList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    trackRepository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    trackRepository.clear();
    tracksList = [];
    for (let i = 0; i < 5; i++) {
      const track: TrackEntity = await trackRepository.save({
        name: faker.lorem.word(),
        duration: faker.number.int(),
      });
      tracksList.push(track);
    }

    albumRepository.clear();
    albumsList = [];
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await albumRepository.save({
        name: faker.lorem.word(),
        albumCover: faker.image.url(),
        releaseDate: faker.date.past(),
        description: faker.lorem.paragraph(),
        tracks: tracksList,
      });
      albumsList.push(album);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new album', async () => {
    const album: AlbumEntity = {
      id: '',
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph(),
      tracks: [],
      performers: [],
    };
    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await albumRepository.findOne({
      where: { id: newAlbum.id },
    });
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.id).toEqual(newAlbum.id);
    expect(storedAlbum.name).toEqual(newAlbum.name);
    expect(storedAlbum.albumCover).toEqual(newAlbum.albumCover);
    expect(storedAlbum.releaseDate).toEqual(newAlbum.releaseDate);
    expect(storedAlbum.description).toEqual(newAlbum.description);
  });

  it('create should throw an exception when the album name is empty', async () => {
    const album: AlbumEntity = {
      id: '',
      name: '',
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph(),
      tracks: [],
      performers: [],
    };
    await expect(service.create(album)).rejects.toHaveProperty(
      'message',
      'The Album name cannot be empty',
    );
  });

  it('create should throw an exception when the album description is empty', async () => {
    const album: AlbumEntity = {
      id: '',
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: '',
      tracks: [],
      performers: [],
    };
    await expect(service.create(album)).rejects.toHaveProperty(
      'message',
      'The Album description cannot be empty',
    );
  });

  it('findAll should return a list of albums', async () => {
    const albums: AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums.length).toEqual(5);
  });

  it('findOne should return an album', async () => {
    const album: AlbumEntity = await service.findOne(albumsList[0].id);
    expect(album).not.toBeNull();
    expect(album.id).toEqual(albumsList[0].id);
    expect(album.name).toEqual(albumsList[0].name);
    expect(album.albumCover).toEqual(albumsList[0].albumCover);
    expect(album.releaseDate).toEqual(albumsList[0].releaseDate);
    expect(album.description).toEqual(albumsList[0].description);
  });

  it('findOne should throw an exception when the album does not exist', async () => {
    await expect(service.findOne('')).rejects.toHaveProperty(
      'message',
      'The Album with the given id was not found',
    );
  });

  it('delete should remove an album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);
    const storedAlbum: AlbumEntity = await albumRepository.findOne({
      where: { id: album.id },
    });
    expect(storedAlbum).toBeNull();
  });

  it('delete should throw an exception when the album does not exist', async () => {
    await expect(service.delete('')).rejects.toHaveProperty(
      'message',
      'The Album with the given id was not found',
    );
  });

  it('delete should throw an exception when the album has tracks', async () => {
    const album: AlbumEntity = await albumRepository.save({
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph(),
      tracks: tracksList,
    });
    await expect(service.delete(album.id)).rejects.toHaveProperty(
      'message',
      'The Album cannot be deleted because it has tracks',
    );
  });
});
