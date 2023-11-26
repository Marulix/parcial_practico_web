import { IsNotEmpty, IsString } from "class-validator";

export class TrackDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly duration: number;

}
