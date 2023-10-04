import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Forbidden, NotFound } from "@panenco/papi";
import { Fridge } from "../../../entities/fridge.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const deleteProduct = async(userId: string, productName: string, fridgeName: string)=>{

    const em = RequestContext.getEntityManager();

    const list = await em.find(ProductQuantity, {});

    const productQuantity = await em.findOneOrFail(ProductQuantity, { $and: [{product: {name: productName}}, {owner: {id: userId}}, {location: {name: fridgeName}}]});

    if (productQuantity.quantity > 1) {
        productQuantity.quantity -= 1;
    }
    else{
        await em.remove(productQuantity);
    }
    em.flush();
    return null;
}