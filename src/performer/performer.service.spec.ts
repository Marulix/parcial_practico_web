import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performersList = [];
    for (let i = 0; i < 5; i++) {
      const performer: PerformerEntity = await repository.save({
        name: faker.lorem.word(),
        image: faker.image.url(),
        description: faker.lorem.paragraph(),
      });
      performersList.push(performer);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return a all performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performersList.length);
  });

  it('findOne should return a performer by id', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    const performer: PerformerEntity = await service.findOne(
      storedPerformer.id,
    );
    expect(performer).not.toBeNull();
    expect(performer.id).toEqual(storedPerformer.id);
    expect(performer.name).toEqual(storedPerformer.name);
    expect(performer.description).toEqual(storedPerformer.description);
    expect(performer.image).toEqual(storedPerformer.image);
  });

  it('findOne should throw an exception when performer id does not exist', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The Performer with the given id was not found',
    );
  });

  it('create should return a new performer', async () => {
    const performer: PerformerEntity = {
      id: '',
      name: faker.lorem.word(),
      description: faker.lorem.word(),
      image: faker.image.url(),
      albums: [],
    };
    const newPerformer: PerformerEntity = await service.create(performer);
    expect(newPerformer).not.toBeNull();

    const storedPerformer: PerformerEntity = await repository.findOne({
      where: { id: newPerformer.id },
    });
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.id).toEqual(newPerformer.id);
    expect(storedPerformer.name).toEqual(newPerformer.name);
    expect(storedPerformer.description).toEqual(newPerformer.description);
    expect(storedPerformer.image).toEqual(newPerformer.image);
  });
});
