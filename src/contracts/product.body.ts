import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class ProductBody {
    
    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public type: string;
    
}