import { Get, JsonController } from "routing-controllers";
import { getList } from "./handlers/getList.handler.js";


@JsonController("/users")
export class UserController{

    @Get("/")
    async getList(){
        return getList();
    }
}