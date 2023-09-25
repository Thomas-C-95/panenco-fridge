import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import { Product } from "./product.entity.js";


@Entity()
export class User extends BaseEntity<User, 'id'>{

    @PrimaryKey({columnType: 'uuid'})
    public id: string = randomUUID();

    @Property( {unique: true} )
    public email: string;

    @Property()
    public name: string;

    @OneToMany('Product', 'owner')
    public products = new Collection<Product>(this);
    
}