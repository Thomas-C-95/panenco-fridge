import { RequestContext } from "@mikro-orm/core"
import { Fridge } from "../../../entities/fridge.entity.js";
import { NotFound } from "@panenco/papi";
import { User } from "../../../entities/user.entity.js";
import e from "express";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";
import { Product } from "../../../entities/product.entity.js";
import { transferProduct } from "../../product/handlers/transferProduct.handler.js";


export const transferFridgeProducts = async (ownerId: string, receiverId: string, fridgeName: string)=>{
    const em = RequestContext.getEntityManager();

    const quantityList = await em.find(ProductQuantity, {$and: [{location: {name: fridgeName}}, {owner: {id: ownerId}}]});

    for (const element of quantityList) {
        
        const product = await em.findOne(Product, {id: element.product.id});
        const quantity = element.quantity;
        for (let index = 0; index < quantity; index++) {
           await transferProduct(ownerId, receiverId, element.product.name);
        }
    };
    
    return [quantityList.map(quantityElem => quantityElem.product), quantityList.length];
}
