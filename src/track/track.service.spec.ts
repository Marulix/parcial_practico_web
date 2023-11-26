import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let trackRepository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let tracksList: TrackEntity[];
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    trackRepository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    albumRepository.clear();
    albumsList = [];
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await albumRepository.save({
        name: faker.lorem.word(),
        albumCover: faker.image.url(),
        releaseDate: faker.date.past(),
        description: faker.lorem.paragraph(),
      });
      albumsList.push(album);
    }

    trackRepository.clear();
    tracksList = [];
    for (let i = 0; i < 5; i++) {
      const track: TrackEntity = await trackRepository.save({
        name: faker.lorem.word(),
        duration: faker.number.int(),
        album: albumsList[i],
      });
      tracksList.push(track);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new track', async () => {
    const track: TrackEntity = {
      id: '',
      name: faker.lorem.word(),
      duration: faker.number.int(),
      album: albumsList[0],
    };

    const album: AlbumEntity = albumsList[0];
    const newTrack: TrackEntity = await service.create(album.id, track);
    expect(newTrack).not.toBeNull();

    const storedTrack: TrackEntity = await trackRepository.findOne({
      where: { id: newTrack.id },
    });
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.id).toEqual(newTrack.id);
    expect(storedTrack.name).toEqual(newTrack.name);
    expect(storedTrack.duration).toEqual(newTrack.duration);
  });

  it('create should throw an exception when the album does not exist', async () => {
    const track: TrackEntity = {
      id: '',
      name: faker.lorem.word(),
      duration: faker.number.int(),
      album: albumsList[0],
    };

    await expect(service.create('', track)).rejects.toHaveProperty(
      'message',
      'The Album with the given id was not found',
    );
  });

  it('create should throw an exception when the track duration is less than or equal to zero', async () => {
    const track: TrackEntity = {
      id: '',
      name: faker.lorem.word(),
      duration: 0,
      album: albumsList[0],
    };

    await expect(
      service.create(albumsList[0].id, track),
    ).rejects.toHaveProperty(
      'message',
      'The Track duration must be greater than zero',
    );
  });

  it('findAll should return a list of tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks.length).toEqual(5);
  });

  it('findOne should return an track', async () => {
    const track: TrackEntity = await service.findOne(tracksList[0].id);
    expect(track).not.toBeNull();
    expect(track.id).toEqual(tracksList[0].id);
    expect(track.name).toEqual(tracksList[0].name);
    expect(track.duration).toEqual(tracksList[0].duration);
  });

  it('findOne should throw an exception when the track does not exist', async () => {
    await expect(service.findOne('')).rejects.toHaveProperty(
      'message',
      'The Track with the given id was not found',
    );
  });
});
