import { Get, JsonController, Post } from "routing-controllers";
import { getList } from "./handlers/getList.handler.js";
import { create } from "./handlers/create.handler.js"
import { Body, Representer, StatusCode } from "@panenco/papi";
import { UserBody } from "../../contracts/user.body.js";
import { UserView } from "../../contracts/user.view.js";

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
}