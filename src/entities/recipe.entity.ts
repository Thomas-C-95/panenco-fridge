import { BaseEntity, Entity, JsonType, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { MaxLength } from "class-validator";
import { User } from "./user.entity.js";


@Entity()
export class Recipe extends BaseEntity<Recipe, 'name'>{

    @PrimaryKey({unique: true})
    public name: string;

    @Property()
    public description: string;

    @Property({type: JsonType})
    public ingredients: {[key: string]: number};

    @ManyToOne('User')
    public owner: Rel<User>;
}
