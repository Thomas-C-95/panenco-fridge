import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query.js";
import { Product } from "../../../entities/product.entity.js";


export const getProductList = (userId:string, query: SearchQuery) => {

    const em = RequestContext.getEntityManager();

    return em.findAndCount(Product, query.search? 
                                        {type: {$ilike: `%${query.search}%`}}
                                        :{})
    
}