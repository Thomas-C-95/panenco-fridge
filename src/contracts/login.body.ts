import { Exclude, Expose } from "class-transformer";
import { IsString, Length } from "class-validator";


@Exclude()
export class LoginBody{

    @Expose()
    @IsString()
    public email:string;

    @Expose()
    @IsString()
    public password: string;
}