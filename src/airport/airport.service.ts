import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AirportService {
    constructor(
        @InjectRepository(AirportEntity)
        private airportRepository: Repository<AirportEntity>,
    ) {}

    async findAll(): Promise<AirportEntity[]> {
        return await this.airportRepository.find({ relations: ['airlines'] });
    }

    async findOne(id: string): Promise<AirportEntity> {
        const Airport: AirportEntity = await this.airportRepository.findOne({where: {id}, relations: ["airlines"] } );
        if (!Airport)
          throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
   
        return Airport;
    }
   
    async create(Airport: AirportEntity): Promise<AirportEntity> {
        if (Airport.code.length != 3)
            throw new BusinessLogicException("The code has to be 3 characters long", BusinessError.BAD_REQUEST);
        return await this.airportRepository.save(Airport);
    }
 
    async update(id: string, Airport: AirportEntity): Promise<AirportEntity> {
        if (Airport.code.length != 3)
          throw new BusinessLogicException("The code has to be 3 characters long", BusinessError.BAD_REQUEST);
        const persistedAirport: AirportEntity = await this.airportRepository.findOne({where:{id}});
        if (!persistedAirport)
          throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
       
        Airport.id = id; 
       
        return await this.airportRepository.save(Airport);
    }
 
    async delete(id: string) {
        const Airport: AirportEntity = await this.airportRepository.findOne({where:{id}});
        if (!Airport)
          throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.airportRepository.remove(Airport);
    }
 }
