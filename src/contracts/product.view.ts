import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";


@Exclude()
export class ProductView{

    @Expose()
    @IsString()
    public id: string;

    @Expose()
    @IsString()
    public type: string;

    @Expose()
    @IsNumber()
    public size: number;

}