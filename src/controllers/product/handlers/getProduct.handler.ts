import { RequestContext } from "@mikro-orm/core"
import { Product } from "../../../entities/product.entity.js";
import { Forbidden } from "@panenco/papi";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const getProduct = async (userId:string, productId: string) => {

    const em = RequestContext.getEntityManager();

    const productquantity = await em.findOneOrFail(ProductQuantity, { $and: [{owner: {id: userId}}, {product: {id: productId}}]});

    const product = await em.findOneOrFail(Product, {id: productquantity.product.id});
    return product;
}