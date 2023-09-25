import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "crypto";


@Entity()
export class User extends BaseEntity<User, 'id'>{

    @PrimaryKey({columnType: 'uuid'})
    public id: string = randomUUID();

    @Property( {unique: true} )
    public email: string;

    @Property()
    public name: string;

    // Think about this
    @Property()
    public products: string[] = [];
    
}