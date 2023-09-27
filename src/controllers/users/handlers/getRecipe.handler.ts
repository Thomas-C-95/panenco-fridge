import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";


export const getRecipe = async(id: string, recipeName: string) =>{

    const em = RequestContext.getEntityManager();
    const user = await em.findOne(User, id);
    await user.recipes.init();
    
    return user.recipes.find( (recipe) => recipe.name === recipeName);

}