import { Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { MaxLength } from "class-validator";
import { User } from "./user.entity.js";


@Entity()
export class Recipe{

    @PrimaryKey({unique: true})
    public name: string;

    @Property()
    public description: string;

    @Property()
    public ingredients: { [key: string]: number };

    @ManyToOne('User')
    public owner: Rel<User>;
}