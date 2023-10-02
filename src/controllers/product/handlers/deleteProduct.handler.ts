import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Forbidden, NotFound } from "@panenco/papi";
import { Fridge } from "../../../entities/fridge.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const deleteProduct = async(userId: string, productName: string, fridgeName: string)=>{

    const em = RequestContext.getEntityManager();
    const productQuantity = await em.findOneOrFail(ProductQuantity, { $and: [{product: {name: productName}}, {owner: {id: userId}}, {location: {name: fridgeName}}]});

    await em.remove(productQuantity).flush();
    
    return null;
}