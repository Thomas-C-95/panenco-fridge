import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

@Exclude()
export class ProductBody {
    
    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsOptional()
    @IsString()
    public type: string;
    
}