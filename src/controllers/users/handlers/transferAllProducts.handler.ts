import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";


export const transferAllProducts = async (ownerId: string, receiverId: string)=>{
    const em = RequestContext.getEntityManager();
    const owner = await em.findOneOrFail(User, {'id': ownerId});
    const receiver = await em.findOneOrFail(User, {'id': receiverId});

    await owner.products.init();
    const products = owner.products.getItems();
   
    products.forEach(element => {
        element.owner = receiver;
    });
    
    owner.products.removeAll();

    await receiver.products.init();
    receiver.products.add(products);

    await em.persistAndFlush([owner, receiver]);
    return [products, products.length];
}