import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class ProductBody {
    
    // Type should be : food or drinks. How to validate?
    @Expose()
    @IsString()
    public type: string;
    
}