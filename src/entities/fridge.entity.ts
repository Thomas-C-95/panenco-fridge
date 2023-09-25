import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product.entity.js";

@Entity()
export class Fridge extends BaseEntity<Fridge, 'name'>{

    @PrimaryKey({unique: true})
    public name: string;

    @Property()
    public location: string;
    
    @Property()
    public capacity: number;

    @OneToMany('Product', 'fridge')
    public contents = new Collection<Product>(this);
}