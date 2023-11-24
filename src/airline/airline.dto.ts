import {IsDate, IsDateString, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AirlineDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    readonly foundationDate: Date;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    readonly webPage: string;

}
