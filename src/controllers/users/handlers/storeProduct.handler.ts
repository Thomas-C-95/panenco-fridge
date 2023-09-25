import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Fridge } from "../../../entities/fridge.entity.js";
import { Unauthorized } from "@panenco/papi";


export const storeProduct = async (userId: string, productId: string, fridgeName: string) => {

    const em = RequestContext.getEntityManager();
    const product = await em.findOne(Product, {'id': productId});

    if (userId !== product.owner.id) {
           throw new Unauthorized("notProductOwner", 'You do not own this product');
    }

    const fridge = await em.findOne(Fridge, {'name': fridgeName});

    fridge.contents.add(product);

    await em.persistAndFlush(fridge);
    return product;
}