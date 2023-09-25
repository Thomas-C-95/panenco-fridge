import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";


@Exclude()
export class UserView{

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public email: string;

}