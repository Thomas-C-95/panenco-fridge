import { RequestContext } from "@mikro-orm/core"
import { Product } from "../../../entities/product.entity.js";
import { Forbidden } from "@panenco/papi";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const getProduct = async (userId:string, productName: string) => {

    const em = RequestContext.getEntityManager();

    const product = await em.findOneOrFail(Product, { $and: [{name: productName}, {owner: {owner: {id: userId}}}]});
    return product;
}