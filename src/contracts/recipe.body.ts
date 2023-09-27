import { Exclude, Expose, Transform } from "class-transformer";
import { Allow, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";


@Exclude()
export class RecipeBody{

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public description: string;

    @Expose()
    @Allow()
    public ingredients: {[key: string]: number};
}