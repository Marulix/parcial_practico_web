import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class PerformerDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    readonly image: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

}
