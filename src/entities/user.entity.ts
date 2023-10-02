import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import { Product } from "./product.entity.js";
import { Recipe } from "./recipe.entity.js";
import { ProductQuantity } from "./product.quantity.entity.js";


@Entity()
export class User extends BaseEntity<User, 'id'>{

    @PrimaryKey({columnType: 'uuid'})
    public id: string = randomUUID();

    @Property( {unique: true} )
    public email: string;

    @Property()
    public name: string;

    @Property()
    public role: string = "user"

    @Property()
    public password: string;

    @OneToMany(()=> ProductQuantity, productQuantity => productQuantity.owner)
    public products = new Collection<ProductQuantity>(this);

    @OneToMany(() => Recipe, recipy => recipy.owner, {orphanRemoval:true})
    public recipes = new Collection<Recipe>(this);
    
}