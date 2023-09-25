import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UserBody{

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public email: string;


}