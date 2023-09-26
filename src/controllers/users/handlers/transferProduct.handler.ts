import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Forbidden } from "@panenco/papi";
import { User } from "../../../entities/user.entity.js";


export const transferProduct = async (ownerId: string, receiverId: string, productId: string)=>{

    const em = RequestContext.getEntityManager();
    
    const product = await em.findOne(Product, {'id': productId});
    if (product.owner.id !== ownerId){
        throw new Forbidden("notProductOwner", 'You do not own this product');
    }
    const owner = await em.findOne(User, {'id': ownerId});
    const receiver = await em.findOne(User, {'id': receiverId});

    await owner.products.init();
    owner.products.remove(product);

    await receiver.products.init();
    receiver.products.add(product);

    await em.persistAndFlush([owner, receiver])
    return product;

}