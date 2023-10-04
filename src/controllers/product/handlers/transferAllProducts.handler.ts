import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";
import { Product } from "../../../entities/product.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";
import { transferProduct } from "./transferProduct.handler.js";


export const transferAllProducts = async (ownerId: string, receiverId: string)=>{
    const em = RequestContext.getEntityManager();
    
    const quantityList = await em.find(ProductQuantity, {owner: {id: ownerId}});

    for (const element of quantityList) {
        
        const product = await em.findOne(Product, {id: element.product.id});
        const quantity = element.quantity;
        for (let index = 0; index < quantity; index++) {
           await transferProduct(ownerId, receiverId, element.product.name);
        }
    };
    
    return [quantityList.map(quantityElem => quantityElem.product), quantityList.length];
}