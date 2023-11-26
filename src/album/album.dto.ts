import { IsNotEmpty, IsString, IsUrl, IsDateString } from "class-validator";

export class AlbumDto {
    
    @IsString()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    readonly albumCover: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    readonly releaseDate: Date;

    @IsString()
    readonly description: string;

}
