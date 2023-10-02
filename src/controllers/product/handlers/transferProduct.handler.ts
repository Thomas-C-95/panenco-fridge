import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Forbidden } from "@panenco/papi";
import { User } from "../../../entities/user.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const transferProduct = async (ownerId: string, receiverId: string, productName: string)=>{

    const em = RequestContext.getEntityManager();
    
    const receiver = await em.findOneOrFail(User, {'id': receiverId}, {populate: ['products']});
    const productquantity = await em.findOneOrFail(ProductQuantity, {$and: [{product: {name: productName}}, {owner: {id: ownerId}}]});

    if (productquantity.quantity === 1 ){
        productquantity.owner = receiver;
        
    }
    else{
        productquantity.quantity -= 1;
        const productquantityList = await em.find(ProductQuantity, {})
        const productQuantityId = Math.max(...productquantityList.map(productquantity => productquantity.id));
        const newQuantity = em.create(ProductQuantity, {id: productQuantityId+1, quantity: 1});
        
        const fridge = productquantity.location;
        const product = productquantity.product;

        fridge.contents.add(newQuantity);
        receiver.products.add(newQuantity);
        product.owner.add(newQuantity);
        
    }
    em.persistAndFlush(productquantity);
    return productquantity.product;

}