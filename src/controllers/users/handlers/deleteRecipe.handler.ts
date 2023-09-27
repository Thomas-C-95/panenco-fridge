import { RequestContext } from "@mikro-orm/core"
import { User } from "../../../entities/user.entity.js";
import { Recipe } from "../../../entities/recipe.entity.js";
import { NotFound } from "@panenco/papi";


export const deleteRecipe = async(id: string, recipeName: string) => {

    const em = RequestContext.getEntityManager();

    const user = await em.findOne(User, id);
    await user.recipes.init();

    const recipe = user.recipes.find(recipe => recipe.name === recipeName);

    if (!recipe){
        throw new NotFound("recipeNotFound", "User does not have a recipe with given name.")
    }
    
    user.recipes.remove(recipe);

    await em.persistAndFlush(user);
    return null;
    
}