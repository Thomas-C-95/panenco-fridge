import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Fridge } from "../../../entities/fridge.entity.js";
import { User } from "../../../entities/user.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const storeProduct = async (userId: string, productName: string, fridgeName: string) => {

    const em = RequestContext.getEntityManager();
    const productlengths = await em.count(ProductQuantity)

    const productquantity = await em.findOne(ProductQuantity, { $and: [{owner: {id: userId}}, {product: {name: productName}}, {location: {name : fridgeName}}]});

    if (!productquantity){
        const product = await em.findOneOrFail(Product, {'name': productName}, {populate: ['owner']});
        const fridge = await em.findOneOrFail(Fridge, {'name': fridgeName}, {populate: ['contents']});
        const user = await em.findOneOrFail(User, {id: userId}, {populate: ['products']});
        const productquantity = em.create(ProductQuantity, {id: productlengths+1, quantity: 1});

        user.products.add(productquantity);
        fridge.contents.add(productquantity);
        product.owner.add(productquantity);

    }
    else{
        productquantity.quantity += 1;
    }

    await em.persistAndFlush(productquantity);

    return;
    

}