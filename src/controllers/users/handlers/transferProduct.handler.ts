import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Forbidden } from "@panenco/papi";
import { User } from "../../../entities/user.entity.js";


export const transferProduct = async (ownerId: string, receiverId: string, productId: string)=>{

    const em = RequestContext.getEntityManager();
    
    const product = await em.findOneOrFail(Product, {'id': productId});
    if (product.owner.id !== ownerId){
        throw new Forbidden("notProductOwner", 'You do not own this product');
    }
    const receiver = await em.findOneOrFail(User, {'id': receiverId});
    product.owner = receiver;
    
    const owner = await em.findOneOrFail(User, {'id': ownerId});
    await owner.products.init();

    await receiver.products.init();
    receiver.products.add(product);

    await em.persistAndFlush([owner, receiver])
    return product;

}