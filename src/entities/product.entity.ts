import { Entity, ManyToMany, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import { Collection } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { randomUUID } from "crypto";
import { Fridge } from "./fridge.entity.js";


@Entity()
export class Product{

    @PrimaryKey({columnType: 'uuid'})
    public id: string = randomUUID();

    @Property()
    public name: string;
    
    @Property()
    public type: string;

    @Property()
    public size: number = Math.floor(Math.random() * 10);

    @ManyToOne('User')
    public owner: Rel<User>; 

    @ManyToMany(() => Fridge, fridge => fridge.contents, {nullable: true}) // many to many -> many to zero
    public fridge = new Collection<Fridge>(this);
}