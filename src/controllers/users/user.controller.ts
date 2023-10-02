import { ActionMetadata, Authorized, Delete, Get, Header, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { createUser } from "./handlers/createUser.handler.js"
import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { UserBody } from "../../contracts/user.body.js";
import { UserView } from "../../contracts/user.view.js";
import { getUser } from "./handlers/getUser.handler.js";
import { buyProduct } from "./handlers/buyProduct.handler.js";
import { ProductBody } from "../../contracts/product.body.js";
import { ProductView } from "../../contracts/product.view.js";
import { storeProduct } from "./handlers/storeProduct.handler.js";
import { deleteProduct } from "./handlers/deleteProduct.handler.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { getProductList } from "../product/handlers/getProductList.handler.js";
import { getProduct } from "../product/handlers/getProduct.handler.js";
import { getFridgeProductList } from "./handlers/getFridgeProductList.handler.js";
import { transferProduct } from "./handlers/transferProduct.handler.js";
import { transferAllProducts } from "./handlers/transferAllProducts.handler.js";
import { transferFridgeProducts } from "./handlers/transferFridgeProducts.js";
import { RecipeBody } from "../../contracts/recipe.body.js";
import { createRecipe } from "./handlers/createRecipe.handler.js";
import { RecipeView } from "../../contracts/recipe.view.js";
import { getRecipeList } from "./handlers/getRecipeList.handler.js";
import { deleteRecipe } from "./handlers/deleteRecipe.handler.js";
import { getRecipe } from "./handlers/getRecipe.handler.js";
import { updateRecipe } from "./handlers/updateRecipe.handler.js";
import { updateMissingIngredients } from "./handlers/updatedMissingIngredients.handler.js";
import { OpenAPI } from "routing-controllers-openapi";
import { request } from "http";
import type { Request } from "express";
import { RequestExt } from "../../utils/request.extension.js";

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

    @Get("/:id/fridges/:fridgeName")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Get all products from frige with given name, belonging to user with given ID"})
    @Authorized()
    async getFridgeProducts(@Param("id") id: string,
                            @Param("fridgeName") fridgeName: string,
                            @Query() query: SearchQuery){
    
        return getFridgeProductList(id, fridgeName, query);
    }

    @Patch("/:id/products/:productId/fridges/:fridgeName")
    // @Representer(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Store product with given ID, belonging to user with given ID, in fridge with given name"})
    @Authorized()
    @Representer(null, StatusCode.noContent)
    async store(@Param("id") id: string,
                        @Param("productId") productId: string,
                        @Param("fridgeName") fridgeName: string,
                        @Req() {token}: RequestExt
                        ){
        console.log(token);
        return storeProduct(token.userId, productId, fridgeName);
    }

    @Delete("/:id/products/:productId/fridges/:fridgeName")
    @Representer(null, StatusCode.noContent)
    @OpenAPI({summary: "Delete specific product for fridge with given name"})
    @Authorized()
    async deleteProduct(@Param("id") id: string,
                        @Param("productId") productId: string,
                        @Param("fridgeName") fridgeName: string,){
        
        return deleteProduct(id, productId, fridgeName);

    }

    // Transfer Products
    @Patch("/transfer/:ownerId/:receiverId/products/:productId")
    @Representer(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Transfer specific product"})
    @Authorized()
    async transferProduct(@Param("ownerId") ownerId: string,
                          @Param("receiverId") receiverId: string,
                          @Param("productId") productId: string){
        return transferProduct(ownerId, receiverId, productId);
    }

    @Patch("/transfer/:ownerId/:receiverId/fridges/:fridgeName")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Transfer all products within given fridge"})
    @Authorized()
    async transferFridge(@Param("ownerId") ownerId: string,
                        @Param("receiverId") receiverId: string,
                        @Param("fridgeName") fridgeName: string){
        return transferFridgeProducts(ownerId,receiverId,fridgeName);
    }

    @Patch("/transfer/:ownerId/:receiverId/products")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "transfer all products belonging to owner"})
    @Authorized()
    async transferAllProducts(@Param("ownerId") ownerId: string,
                              @Param("receiverId") receiverId: string){
        return transferAllProducts(ownerId, receiverId)
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