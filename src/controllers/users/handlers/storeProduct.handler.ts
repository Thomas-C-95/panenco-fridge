import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Fridge } from "../../../entities/fridge.entity.js";
import { Forbidden} from "@panenco/papi";


export const storeProduct = async (userId: string, productId: string, fridgeName: string) => {

    const em = RequestContext.getEntityManager();
    const product = await em.findOneOrFail(Product, {'id': productId});

    if (userId !== product.owner.id) {
           throw new Forbidden("notProductOwner", 'You do not own this product');
    }

    const fridge = await em.findOneOrFail(Fridge, {'name': fridgeName});

    await fridge.contents.init();
    const currentStorage = fridge.contents.getItems().map(prod=>prod.size).reduce((a,b)=>a+b, 0);

    if (currentStorage + product.size > fridge.capacity){
        throw new Forbidden("exceedsCapacity", 'Fridge capacity would be exceeded');
    }

    fridge.contents.add(product);

    await em.persistAndFlush(fridge);
    return product;
}