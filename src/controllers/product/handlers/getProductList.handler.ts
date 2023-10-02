import { RequestContext } from "@mikro-orm/core";
import { SearchQuery } from "../../../contracts/search.query.js";
import { Product } from "../../../entities/product.entity.js";
import { User } from "../../../entities/user.entity.js";
import { ProductQuantity } from "../../../entities/product.quantity.entity.js";


export const getProductList = async (userId:string, query: SearchQuery) => {

    const em = RequestContext.getEntityManager();

    return em.findAndCount(Product, query.search? { $and: [{owner: {owner: {id: userId}}}, {owner: {location: {name: query.search}}}]}: {owner: {owner: {id: userId}}})
}