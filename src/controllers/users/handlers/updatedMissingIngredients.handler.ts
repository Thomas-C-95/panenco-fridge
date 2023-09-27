import { RequestContext } from "@mikro-orm/core"
import { User } from "../../../entities/user.entity.js";
import { Product } from "../../../entities/product.entity.js";


export const updateMissingIngredients = async (id: string, recipeName: string) => {

    const em = RequestContext.getEntityManager();

    const user = await em.findOneOrFail(User, id);
    await user.recipes.init();
    await user.products.init();
    const recipe = user.recipes.find(recipe => recipe.name === recipeName);

    // Loop over ingredients
    for (let key in recipe.ingredients){
        let currentIngredientsCount = user.products.filter(product => product.name === key).length;

        for (let i=0; i<recipe.ingredients[key]-currentIngredientsCount; i++){
            user.products.add(em.create(Product, {name: key}));
        }
    }
    await em.persistAndFlush(user);
    return user;

}