import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";


@Exclude()
export class AccessTokenView{

    @Expose()
    @IsString()
    public token: String;

    @Expose()
    @IsNumber()
    public expiresIn: number; 
}