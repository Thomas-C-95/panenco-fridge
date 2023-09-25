import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { Product } from "../entities/product.entity.js";

@Exclude()
export class FridgeView{
   
    @Expose()
    @IsString()
    public name: string

    @Expose()
    @IsString()
    public location: string

    @Expose()
    @IsNumber()
    public capacity: number

    @Expose()
    public contents: Product[];
}