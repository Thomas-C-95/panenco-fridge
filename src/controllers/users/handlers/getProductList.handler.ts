import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query.js";
import { Product } from "../../../entities/product.entity.js";
import { User } from "../../../entities/user.entity.js";


export const getProductList = async (userId:string, query: SearchQuery) => {

    const em = RequestContext.getEntityManager();

    return em.findAndCount(Product, query.search? { $and: [{owner: {id: userId}}, {name: query.search}]}: {owner: {id: userId}})
}