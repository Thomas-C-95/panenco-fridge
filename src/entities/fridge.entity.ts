import { BaseEntity, Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product.entity.js";
import { ProductQuantity } from "./product.quantity.entity.js";

@Entity()
export class Fridge extends BaseEntity<Fridge, 'name'>{

    @PrimaryKey({unique: true})
    public name: string;

    @Property()
    public location: string;
    
    @Property()
    public capacity: number;

    @OneToMany(()=> ProductQuantity, productQuantity => productQuantity.location)
    public contents = new Collection<ProductQuantity>(this);
}