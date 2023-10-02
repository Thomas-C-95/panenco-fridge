import { ActionMetadata, Authorized, Delete, Get, Header, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { createUser } from "./handlers/createUser.handler.js"
import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { UserBody } from "../../contracts/user.body.js";
import { UserView } from "../../contracts/user.view.js";
import { getUser } from "./handlers/getUser.handler.js";
import { RecipeBody } from "../../contracts/recipe.body.js";
import { createRecipe } from "./handlers/createRecipe.handler.js";
import { RecipeView } from "../../contracts/recipe.view.js";
import { getRecipeList } from "./handlers/getRecipeList.handler.js";
import { deleteRecipe } from "./handlers/deleteRecipe.handler.js";
import { getRecipe } from "./handlers/getRecipe.handler.js";
import { updateRecipe } from "./handlers/updateRecipe.handler.js";
import { updateMissingIngredients } from "./handlers/updatedMissingIngredients.handler.js";
import { OpenAPI } from "routing-controllers-openapi";
@JsonController("/users")
export class UserController{

    @Post("/")
    @Representer(UserView, StatusCode.created)
    @OpenAPI({summary: "Create new user"})
    async createUser(@Body() body: UserBody){
        return createUser(body);
    }

    @Get("/:id")
    @Representer(UserView, StatusCode.ok)
    @OpenAPI({summary: "Get user with given ID"})
    @Authorized()
    async getUser(@Param("id") id: string){
        return getUser(id);

    }

    // CRUD recipes
    @Post("/:id/recipes")
    @Representer(RecipeView, StatusCode.created)
    @OpenAPI({summary: "Create new recipe for user"})
    @Authorized()
    async createRecipe(@Param("id") id: string,
                       @Body() body: RecipeBody){
        return createRecipe(id, body);
    }
    @Get("/:id/recipes")
    @ListRepresenter(RecipeView, StatusCode.ok)
    @OpenAPI({summary: "Get all recipes belonging to user"})
    @Authorized()
    async getRecipeList(@Param("id") id:string){
        return getRecipeList(id);
    }

    @Delete("/:id/recipes/:recipeName")
    @Representer(null, StatusCode.noContent)
    @OpenAPI({summary: "Delete a specific recipe"})
    @Authorized()
    async deleteRecipe(@Param("id") id: string,
                       @Param("recipeName") recipeName: string){
        return deleteRecipe(id, recipeName);
    }

    @Get("/:id/recipes/:recipeName")
    @Representer(RecipeView, StatusCode.ok)
    @OpenAPI({summary: "Get a specific recipe"})
    @Authorized()
    async getRecipe(@Param("id") id: string,
                    @Param("recipeName") recipeName: string){
        return getRecipe(id, recipeName);
    }

    @Patch("/:id/recipes/:recipeName")
    @Representer(RecipeView, StatusCode.ok)
    @OpenAPI({summary: "Update a specific recipe"})
    @Authorized()
    async updateRecipe(@Param("id") id: string,
                       @Param("recipeName") recipeName: string,
                       @Body({}, {skipMissingProperties: true}) body: RecipeBody){
        return updateRecipe(id, recipeName, body);
    }

    @Patch("/:id/recipes/:recipeName/missing")
    @Representer(UserView, StatusCode.ok)
    @OpenAPI({summary: "Update list of products from user to include all necessary products for given recipe"})
    @Authorized()
    async updateMissingIngredients(@Param("id") id: string,
                                   @Param("recipeName") recipeName: string){
    
        return updateMissingIngredients(id, recipeName);
    }

}