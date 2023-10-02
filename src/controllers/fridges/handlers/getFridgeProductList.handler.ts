import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query.js";
import { Fridge } from "../../../entities/fridge.entity.js";
import { Product } from "../../../entities/product.entity.js";


export const getFridgeProductList = async (userId: string, fridgeName: string, query: SearchQuery)=>{

    const em = RequestContext.getEntityManager();

    return em.findAndCount(Product, {$and: [{owner: {owner: {id: userId}}}, {owner: {location: {name: fridgeName}}}]});
    
    // Alternative (but longer)
    // const fridge = await em.findOneOrFail(Fridge, {'name': fridgeName});
    
    // await fridge.contents.init();
    // const userProducts = fridge.contents.filter(product => product.owner.id === userId);
    
    // return [userProducts, userProducts.length];
}