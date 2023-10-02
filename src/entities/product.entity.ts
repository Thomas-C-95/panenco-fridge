import { Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import { Collection } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { randomUUID } from "crypto";
import { Fridge } from "./fridge.entity.js";
import { ProductQuantity } from "./product.quantity.entity.js";


@Entity()
export class Product{

    @PrimaryKey({columnType: 'uuid'})
    public id: string = randomUUID();

    @Property({unique: true})
    public name: string;

    @Property()
    public size: number;

    @OneToMany(() => ProductQuantity, productQuantity => productQuantity.product)
    public owner = new Collection<ProductQuantity>(this); 

}