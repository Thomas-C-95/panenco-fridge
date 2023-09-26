import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query.js";
import { Fridge } from "../../../entities/fridge.entity.js";


export const getFridgeProductList = async (userId: string, fridgeName: string, query: SearchQuery)=>{

    const em = RequestContext.getEntityManager();
    const fridge = await em.findOne(Fridge, {'name': fridgeName});
    
    await fridge.contents.init();
    const userProducts = fridge.contents.filter(product => product.owner.id === userId);
    
    return [userProducts, userProducts.length];
}