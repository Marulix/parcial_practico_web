import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await repository.save({
      name: faker.lorem.word(),
      code: faker.lorem.word().substring(0,3).toUpperCase(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),})
      airportsList.push(airport);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('findAll should return a all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it ('findOne should return a airport by id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.id).toEqual(storedAirport.id);
    expect(airport.name).toEqual(storedAirport.name);
    expect(airport.code).toEqual(storedAirport.code);
    expect(airport.country).toEqual(storedAirport.country);
    expect(airport.city).toEqual(storedAirport.city);
  });

  it ('findOne should throw an exception when airport id does not exist', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty('message', 'The Airport with the given id was not found');
  });

  it ('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.lorem.word(),
      code: faker.lorem.word().substring(0,3).toUpperCase(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
      airlines: []
    }
    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({where: {id: newAirport.id}})
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.id).toEqual(newAirport.id);
    expect(storedAirport.name).toEqual(newAirport.name);
    expect(storedAirport.code).toEqual(newAirport.code);
    expect(storedAirport.country).toEqual(newAirport.country);
    expect(storedAirport.city).toEqual(newAirport.city);

  });

  it ('create should throw an exception when code is not 3 characters long', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.lorem.word(),
      code: faker.lorem.word().substring(0,2).toUpperCase(),
      country: faker.lorem.word(),
      city: faker.lorem.word(),
      airlines: []
    }
    await expect(service.create(airport)).rejects.toHaveProperty('message', 'The code has to be 3 characters long');
  });

  it ('update should modify an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = "New name";
    airport.code = "NEW";

    const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({where: {id: airport.id}})
    expect(updatedAirport).not.toBeNull();
    expect(updatedAirport.id).toEqual(storedAirport.id);
    expect(updatedAirport.name).toEqual(airport.name);
    expect(updatedAirport.code).toEqual(airport.code);
    expect(updatedAirport.country).toEqual(airport.country);
    expect(updatedAirport.city).toEqual(airport.city);
  });

  it ('update should throw an exception when airport id does not exist', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.id = "0";
    await expect(service.update(airport.id, airport)).rejects.toHaveProperty('message', 'The Airport with the given id was not found');
  });

  it ('update should throw an exception when code is not 3 characters long', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.code = faker.lorem.word().substring(0,2).toUpperCase();
    await expect(service.update(airport.id, airport)).rejects.toHaveProperty('message', 'The code has to be 3 characters long');
  });

  it ('delete should remove an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
    const storedAirport: AirportEntity = await repository.findOne({where: {id: airport.id}})
    expect(storedAirport).toBeNull();
  });

  it ('delete should throw an exception when airport id does not exist', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty('message', 'The Airport with the given id was not found');
  });

});
