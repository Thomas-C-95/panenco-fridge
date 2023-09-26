import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";


export const transferAllProducts = async (ownerId: string, receiverId: string)=>{
    const em = RequestContext.getEntityManager();
    const owner = await em.findOne(User, {'id': ownerId});
    await owner.products.init();

    const products = owner.products.getItems();
    owner.products.removeAll();

    const receiver = await em.findOne(User, {'id': receiverId});
    await receiver.products.init();
    receiver.products.add(products);

    await em.persistAndFlush([owner, receiver]);
    return [products, products.length];
}