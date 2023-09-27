import { RequestContext } from "@mikro-orm/core"
import { Fridge } from "../../../entities/fridge.entity.js";
import { NotFound } from "@panenco/papi";
import { User } from "../../../entities/user.entity.js";
import e from "express";


export const transferFridgeProducts = async (ownerId: string, receiverId: string, fridgeName: string)=>{
    const em = RequestContext.getEntityManager();

    const fridge = await em.findOneOrFail(Fridge, {'name': fridgeName});
    await fridge.contents.init();

    const fridgeproducts = fridge.contents.filter(product => product.owner.id === ownerId);

    if (!fridgeproducts){
        throw new NotFound("noProducts", "No products found in this fridge");
    }
    
    const owner = await em.findOneOrFail(User, {'id': ownerId});
    await owner.products.init();
    owner.products.remove(fridgeproducts);

    const receiver = await em.findOneOrFail(User, {'id': receiverId});
    await receiver.products.init();
    receiver.products.add(fridgeproducts);

    em.persistAndFlush([owner, receiver]);
    return [fridgeproducts, fridgeproducts.length]

}