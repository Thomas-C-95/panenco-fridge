import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";
import { Product } from "../../../entities/product.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const transferAllProducts = async (ownerId: string, receiverId: string)=>{
    const em = RequestContext.getEntityManager();
    
    const quantityList = await em.find(ProductQuantity, {owner: {id: ownerId}});
    const receiver = await em.findOneOrFail(User, {id: receiverId});

    quantityList.forEach(element => {
        element.owner = receiver;
    });

    await em.persistAndFlush(quantityList);
    
    return [quantityList.map(quantityelem => quantityelem.product), quantityList.length];
}