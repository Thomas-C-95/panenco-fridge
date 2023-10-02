import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { Fridge } from "./fridge.entity.js";
import { Product } from "./product.entity.js";


@Entity()
export class ProductQuantity extends BaseEntity<ProductQuantity, 'id'>{

    @PrimaryKey({unique: true})
    public id: number;

    @ManyToOne('User', {nullable: true})
    public owner: Rel<User>;

    @ManyToOne('Fridge', {nullable: true})
    public location: Rel<Fridge>;

    @ManyToOne('Product', {nullable: true})
    public product: Rel<Product>;

    @Property()
    public quantity: number = 0;

}