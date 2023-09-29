import { Body, Forbidden, Representer, StatusCode } from "@panenco/papi";
import { Authorized, JsonController, Post } from "routing-controllers";
import { Fridge } from "../../entities/fridge.entity.js";
import { FridgeBody } from "../../contracts/fridge.body.js";
import { create } from "./handlers/create.handler.js";
import { FridgeView } from "../../contracts/fridge.view.js";
import { Request } from "express";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../entities/user.entity.js";

export const validateAdmin = async(request: Request)=>{

    const userid = request.params.id;
    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, {id: userid});

    if (user.role !== 'admin'){
        throw new Forbidden("notAdmin", "Only admins can create fridges");
    }
    return;
}
@JsonController('/fridges')
export class FridgeController{

    @Post('/:id')
    @Representer(FridgeView, StatusCode.created)
    @Authorized(validateAdmin)
    async create(@Body() body: FridgeBody){
        return create(body);
    }
}