import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/product.body.js";
import { User } from "../../../entities/user.entity.js";
import { Product } from "../../../entities/product.entity.js";


export const buyProduct = async (id: string, requestedProduct: ProductBody) => {

    const em = RequestContext.getEntityManager();

    const user = await em.findOneOrFail(User, {id});
    const product = em.create(Product, requestedProduct);
    user.products.add(product);

    await em.persistAndFlush(user);

    return product;

}