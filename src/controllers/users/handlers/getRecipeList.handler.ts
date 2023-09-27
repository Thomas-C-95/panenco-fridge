import { RequestContext } from "@mikro-orm/core"
import { Recipe } from "../../../entities/recipe.entity.js";
import { User } from "../../../entities/user.entity.js";


export const getRecipeList = async (id: string) => {

    const em = RequestContext.getEntityManager();

    const user = await em.findOne(User, id)

    await user.recipes.init();
    const recipes = user.recipes.getItems();
    return [recipes, recipes.length]

}