import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipe.body.js";
import { Recipe } from "../../../entities/recipe.entity.js";


export const updateRecipe = async(id: string, recipeName: string, recipe: RecipeBody) => {

    const em = RequestContext.getEntityManager();
    const currentRecipe = await em.findOneOrFail(Recipe, {name: recipeName, owner: id});

    currentRecipe.assign(recipe);

    if (recipe.ingredients){ // We want to override current ingredients, not append to current list
        currentRecipe.ingredients = recipe.ingredients;
    }
    em.flush();
    return currentRecipe;
}