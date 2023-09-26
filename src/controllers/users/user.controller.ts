import { Delete, Get, JsonController, Param, Patch, Post } from "routing-controllers";
import { createUser } from "./handlers/createUser.handler.js"
import { Body, Representer, StatusCode } from "@panenco/papi";
import { UserBody } from "../../contracts/user.body.js";
import { UserView } from "../../contracts/user.view.js";
import { getUser } from "./handlers/getUser.handler.js";
import { buyProduct } from "./handlers/buyProduct.handler.js";
import { ProductBody } from "../../contracts/product.body.js";
import { ProductView } from "../../contracts/product.view.js";
import { storeProduct } from "./handlers/storeProduct.handler.js";

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

}