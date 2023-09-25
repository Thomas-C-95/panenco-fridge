import { Get, JsonController, Param, Patch, Post } from "routing-controllers";
import { getList } from "./handlers/getList.handler.js";
import { create } from "./handlers/create.handler.js"
import { Body, Representer, StatusCode } from "@panenco/papi";
import { UserBody } from "../../contracts/user.body.js";
import { UserView } from "../../contracts/user.view.js";
import { get } from "./handlers/get.handler.js";
import { buyProduct } from "./handlers/buyProduct.handler.js";
import { ProductBody } from "../../contracts/product.body.js";
import { ProductView } from "../../contracts/product.view.js";

@JsonController("/users")
export class UserController{

    @Get("/")
    async getList(){
        return getList();
    }

    @Post("/")
    @Representer(UserView, StatusCode.created)
    async create(@Body() body: UserBody){
        return create(body);
    }

    @Get("/:id")
    @Representer(UserView, StatusCode.ok)
    async get(@Param("id") id: string){
        return get(id);
    }

    @Post("/:id")
    @Representer(ProductView, StatusCode.created)
    async buyProduct(@Param("id") id: string,
                     @Body() body: ProductBody){
        return buyProduct(id, body)
    }

}