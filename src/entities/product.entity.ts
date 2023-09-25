import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { randomUUID } from "crypto";
import { Fridge } from "./fridge.entity.js";


@Entity()
export class Product{

    @PrimaryKey({columnType: 'uuid'})
    public id: string = randomUUID();
    
    @Property()
    public type: string;

    @Property()
    public size: number = Math.floor(Math.random() * 10);

    @ManyToOne('User')
    public owner: User; 

    @ManyToOne('Fridge')
    public fridge?: Fridge;
}