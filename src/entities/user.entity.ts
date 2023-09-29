import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import { Product } from "./product.entity.js";
import { Recipe } from "./recipe.entity.js";


@Entity()
export class User extends BaseEntity<User, 'id'>{

    @PrimaryKey({columnType: 'uuid'})
    public id: string = randomUUID();

    @Property( {unique: true} )
    public email: string;

    @Property()
    public name: string;

    @Property()
    public password: string;

    @OneToMany(()=> Product, product => product.owner)
    public products = new Collection<Product>(this);

    @OneToMany(() => Recipe, recipy => recipy.owner, {orphanRemoval:true})
    public recipes = new Collection<Recipe>(this);
    
}