import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AirportDto } from '../airport/airport.dto';
import { plainToInstance } from 'class-transformer';
import { AirportEntity } from '../airport/airport.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
   constructor(private readonly airlineAirportService: AirlineAirportService){}

@Post(':airlineId/airports/:airportId')
   async addAirportAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
       return await this.airlineAirportService.addAirportAirline(airlineId, airportId);
   }

@Get(':airlineId/airports/:airportId')
    async findAirportByAirlineIdAirportId(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
        return await this.airlineAirportService.findAirportFromAirline(airlineId, airportId);
    }

@Get(':airlineId/airports')
   async findAirportsByAirlineId(@Param('airlineId') airlineId: string){
       return await this.airlineAirportService.findAirportsFromAirline(airlineId);
   }

@Put(':airlineId/airports')
   async associateAirportsAirline(@Body() airportsDto: AirportDto[], @Param('airlineId') airlineId: string){
       const airports = plainToInstance(AirportEntity, airportsDto)
       return await this.airlineAirportService.updateAirportsFromAirline(airlineId, airports);
   }

@Delete(':airlineId/airports/:airportId')
@HttpCode(204)
      async deleteAirportAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
          return await this.airlineAirportService.deleteAirportFromAirline(airlineId, airportId);
      }

}
