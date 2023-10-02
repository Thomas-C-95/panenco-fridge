import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Fridge } from "../../../entities/fridge.entity.js";
import { User } from "../../../entities/user.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";
import { Forbidden } from "@panenco/papi";


export const storeProduct = async (userId: string, productName: string, fridgeName: string) => {

    const em = RequestContext.getEntityManager();

    // Check if fridge has capacity
    const fridge = await em.findOneOrFail(Fridge, {'name': fridgeName}, {populate: ['contents']});
    const fridgestorage = fridge.contents.getItems().map(item => item.product.size).reduce((a, b) => a + b, 0); // Not correct, does not take quantity into account

    const product = await em.findOneOrFail(Product, {'name': productName}, {populate: ['owner']});
    const productsize = product.size;

    if (fridgestorage + productsize > fridge.capacity){
        throw new Forbidden("fridgeFull", 'Fridge is full');
        return
    }

    // Check if product is already in some fridge 
    const productquantityList = await em.find(ProductQuantity, {})
    const productQuantityId = Math.max(...productquantityList.map(productquantity => productquantity.id));
    const productquantity = await em.findOne(ProductQuantity, { $and: [{owner: {id: userId}}, {product: {name: productName}}, {location: {name : fridgeName}}]});
    
    if (!productquantity){
        // Add new product to user and fridge
        const user = await em.findOneOrFail(User, {id: userId}, {populate: ['products']});
        const productquantity = em.create(ProductQuantity, {id: productQuantityId+1, quantity: 1});

        user.products.add(productquantity);
        fridge.contents.add(productquantity);
        product.owner.add(productquantity);

    }
    else{
        productquantity.quantity += 1;
    }

    await em.persistAndFlush(productquantity);

    return productquantity.product;
    

}