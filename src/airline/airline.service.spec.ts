import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airline: AirlineEntity = await repository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      foundationDate:faker.date.past(),
      webPage: faker.internet.url()})
      airlinesList.push(airline);
      
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('findAll should return a all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it ('findOne should return a airline by id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.id).toEqual(storedAirline.id);
    expect(airline.name).toEqual(storedAirline.name);
    expect(airline.description).toEqual(storedAirline.description);
    expect(airline.foundationDate).toEqual(storedAirline.foundationDate);
    expect(airline.webPage).toEqual(storedAirline.webPage);
  });

  it ('findOne should throw an exception when airline id does not exist', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty('message', 'The Airline with the given id was not found');
  });

  it ('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.past(),
      webPage: faker.internet.url(),
      airports: []
    }
    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({where: {id: newAirline.id}})
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.id).toEqual(newAirline.id);
    expect(storedAirline.name).toEqual(newAirline.name);
    expect(storedAirline.description).toEqual(newAirline.description);
    expect(storedAirline.foundationDate).toEqual(newAirline.foundationDate);
    expect(storedAirline.webPage).toEqual(newAirline.webPage);

  });

  it ('create should throw an exception when foundation date is in the future', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.future(),
      webPage: faker.internet.url(),
      airports: []
    }
    await expect(service.create(airline)).rejects.toHaveProperty('message', 'The foundation date has to be a date in the past');
  });

  it ('update should modify an airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = "New name";
    airline.description = "New description";

    const updatedAirline: AirlineEntity = await service.update(airline.id, airline);
    expect(updatedAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({where: {id: airline.id}})
    expect(updatedAirline).not.toBeNull();
    expect(updatedAirline.id).toEqual(storedAirline.id);
    expect(updatedAirline.name).toEqual(airline.name);
    expect(updatedAirline.description).toEqual(airline.description);
    expect(updatedAirline.foundationDate).toEqual(airline.foundationDate);
    expect(updatedAirline.webPage).toEqual(airline.webPage);
  });

  it ('update should throw an exception when airline id does not exist', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.id = "0";
    await expect(service.update(airline.id, airline)).rejects.toHaveProperty('message', 'The Airline with the given id was not found');
  });

  it ('update should throw an exception when foundation date is in the future', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.foundationDate = faker.date.future();
    await expect(service.update(airline.id, airline)).rejects.toHaveProperty('message', 'The foundation date has to be a date in the past');
  });

  it ('delete should remove an airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
    const storedAirline: AirlineEntity = await repository.findOne({where: {id: airline.id}})
    expect(storedAirline).toBeNull();
  });

  it ('delete should throw an exception when airline id does not exist', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty('message', 'The Airline with the given id was not found');
  });

});
