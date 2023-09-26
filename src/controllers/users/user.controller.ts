import { Delete, Get, JsonController, Param, Patch, Post } from "routing-controllers";
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
import { get } from "http";
import { SearchQuery } from "../../contracts/search.query.js";
import { getProductList } from "./handlers/getProductList.handler.js";

@JsonController("/users")
export class UserController{

    @Post("/")
    @Representer(UserView, StatusCode.created)
    async createUser(@Body() body: UserBody){
        return createUser(body);
    }

    @Get("/:id")
    @Representer(UserView, StatusCode.ok)
    async getUser(@Param("id") id: string){
        return getUser(id);

    }

    @Get("/:id/products")
    @ListRepresenter(ProductView, StatusCode.ok)
    async getProducts(@Param("id") id: string,
                      @Query() query: SearchQuery){
        return getProductList(id, query);
    }

    @Post("/:id/products")
    @Representer(ProductView, StatusCode.created)
    async buyProduct(@Param("id") id: string,
                     @Body() body: ProductBody){
        return buyProduct(id, body)
    }

    @Patch("/:id/products/:productId/fridges/:fridgeName")
    @Representer(ProductView, StatusCode.ok)
    async store(@Param("id") id: string,
                        @Param("productId") productId: string,
                        @Param("fridgeName") fridgeName: string,
                        ){
        return storeProduct(id, productId, fridgeName);
    }

    @Delete("/:id/products/:productId/fridges/:fridgeName")
    @Representer(null, StatusCode.noContent)
    async deleteProduct(@Param("id") id: string,
                        @Param("productId") productID: string,
                        @Param("fridgeName") fridgeName: string){
    
        return deleteProduct(id, productID, fridgeName)
    }
}