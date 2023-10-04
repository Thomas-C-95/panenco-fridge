import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Forbidden } from "@panenco/papi";
import { User } from "../../../entities/user.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";
import { Fridge } from "../../../entities/fridge.entity.js";


export const transferProduct = async (ownerId: string, receiverId: string, productName: string)=>{

    const em = RequestContext.getEntityManager();
    
    const ownerProductQuantity = await em.findOneOrFail(ProductQuantity, {$and: [{product: {name: productName}}, {owner: {id: ownerId}}]});
    
    // Decrement or remove owner product quantity
    if (ownerProductQuantity.quantity === 1 ){
        await em.remove(ownerProductQuantity);
    }
    else{
        ownerProductQuantity.quantity -= 1;
    }
    
    const receiver = await em.findOneOrFail(User, {'id': receiverId}, {populate: ['products']});
    const receiverProductQuantity = await em.findOne(ProductQuantity, {$and: [{product: {name: productName}}, {owner: {id: receiverId}}]});
    
    // Increment or create receiver product quantity
    if (receiverProductQuantity){
        receiverProductQuantity.quantity += 1;
    }
    else{
        // Calculate Id for new productQuantity entity
        const productquantityList = await em.find(ProductQuantity, {})
        const productQuantityId = Math.max(...productquantityList.map(productquantity => productquantity.id));
        
        const newQuantity = em.create(ProductQuantity, {id: productQuantityId+1, quantity: 1});
        
        const fridge = await em.findOneOrFail(Fridge, {name: ownerProductQuantity.location.name}, {populate: ['contents']});
        const product = await em.findOneOrFail(Product, {name: productName}, {populate: ['owner']});
    
        fridge.contents.add(newQuantity);
        receiver.products.add(newQuantity);
        product.owner.add(newQuantity);
        em.persist(newQuantity);
    }
    em.flush();
    return null;
}