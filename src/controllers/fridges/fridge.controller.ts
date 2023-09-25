import { Body, Representer, StatusCode } from "@panenco/papi";
import { JsonController, Post } from "routing-controllers";
import { Fridge } from "../../entities/fridge.entity.js";
import { FridgeBody } from "../../contracts/fridge.body.js";
import { create } from "./handlers/create.handler.js";
import { FridgeView } from "../../contracts/fridge.view.js";


@JsonController('/fridges')
export class FridgeController{

    @Post('/')
    @Representer(FridgeView, StatusCode.created)
    async create(@Body() body: FridgeBody){
        return create(body);
    }
}