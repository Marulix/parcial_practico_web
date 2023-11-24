import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await repository.save({
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph()});
      albumsList.push(album);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('create should return a new album', async () => {
    const album: AlbumEntity = {
      id: "",
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph(),
      tracks: [],
      performers: []

    }
    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.id).toEqual(newAlbum.id);
    expect(storedAlbum.name).toEqual(newAlbum.name);
    expect(storedAlbum.albumCover).toEqual(newAlbum.albumCover);
    expect(storedAlbum.releaseDate).toEqual(newAlbum.releaseDate);
    expect(storedAlbum.description).toEqual(newAlbum.description);

  });

  it ('create should throw an exception when the album name is empty', async () => {
    const album: AlbumEntity = {
      id: "",
      name: "",
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: faker.lorem.paragraph(),
      tracks: [],
      performers: []

    }
    await expect(service.create(album)).rejects.toHaveProperty('message', 'The Album name cannot be empty');
  }
  );

  it ('create should throw an exception when the album description is empty', async () => {
    const album: AlbumEntity = {
      id: "",
      name: faker.lorem.word(),
      albumCover: faker.image.url(),
      releaseDate: faker.date.past(),
      description: "",
      tracks: [],
      performers: []

    }
    await expect(service.create(album)).rejects.toHaveProperty('message', 'The Album description cannot be empty');
  }
  );

});
