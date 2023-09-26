import { RequestContext } from "@mikro-orm/core"
import { Product } from "../../../entities/product.entity.js";
import { Forbidden } from "@panenco/papi";


export const getProduct = async (userId:string, productId: string) => {

    const em = RequestContext.getEntityManager();

    const product = await em.findOne(Product, {'id': productId});

    if (userId !== product.owner.id){
        throw new Forbidden("notProductOwner", 'You do not own this product');
    }

    return product;
}