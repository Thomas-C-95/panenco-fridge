import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipe.body.js";
import { Recipe } from "../../../entities/recipe.entity.js";
import { User } from "../../../entities/user.entity.js";


export const createRecipe = async (id: string, recipe: RecipeBody) => {

    const em = RequestContext.getEntityManager();

    const user = await em.findOne(User, id);
    const createdRecipe = await em.create(Recipe, recipe);
    user.recipes.add(createdRecipe);
    
    await em.persistAndFlush(user);

    return createdRecipe;
}