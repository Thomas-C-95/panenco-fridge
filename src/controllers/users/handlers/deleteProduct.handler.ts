import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Forbidden, NotFound } from "@panenco/papi";
import { Fridge } from "../../../entities/fridge.entity.js";


export const deleteProduct = async(userId: string, productId: string, fridgeName: string)=>{

    const em = RequestContext.getEntityManager();
    const product = await em.findOneOrFail(Product, {'id': productId});

    if (userId !== product.owner.id){
        throw new Forbidden("notProductOwner", 'You do not own this product');
    }

    const fridge = await em.findOneOrFail(Fridge, {'name': fridgeName});
    await fridge.contents.init();
    const fridgeProduct =fridge.contents.find(product => productId === product.id);

    if (!fridgeProduct){
        throw new NotFound("productNotFound", 'Product not found in fridge');
    }

    fridge.contents.remove(fridgeProduct);
    em.remove(product);
    await em.persistAndFlush(fridge);

    return null;
}