import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportController } from './airport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';

@Module({
  providers: [AirportService],
  controllers: [AirportController],
  imports: [TypeOrmModule.forFeature([AirportEntity])],
})
export class AirportModule {}
