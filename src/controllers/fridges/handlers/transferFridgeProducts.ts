import { RequestContext } from "@mikro-orm/core"
import { Fridge } from "../../../entities/fridge.entity.js";
import { NotFound } from "@panenco/papi";
import { User } from "../../../entities/user.entity.js";
import e from "express";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const transferFridgeProducts = async (ownerId: string, receiverId: string, fridgeName: string)=>{
    const em = RequestContext.getEntityManager();

    const receiver = await em.findOneOrFail(User, {'id': receiverId}, {populate: ['products']});
    const productQuantityList = await em.find(ProductQuantity, {$and: [{location: {name: fridgeName}}, {owner: {id: ownerId}}]});

    productQuantityList.forEach(element => {
        element.owner = receiver;
    });

    em.persistAndFlush(productQuantityList);
    return [productQuantityList.map(quantityElem => quantityElem.product), productQuantityList.length];

}