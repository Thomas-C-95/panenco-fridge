import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class UserBody{

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public email: string;

    @Expose()
    @IsString()
    @IsOptional()
    public role: string;

    @Expose()
    @IsString()
    @Length(8)
    public password: string;


}