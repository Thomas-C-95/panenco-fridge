import { Body, Forbidden, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { Authorized, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { Fridge } from "../../entities/fridge.entity.js";
import { FridgeBody } from "../../contracts/fridge.body.js";
import { create } from "./handlers/create.handler.js";
import { FridgeView } from "../../contracts/fridge.view.js";
import { Request } from "express";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../entities/user.entity.js";
import { ProductView } from "../../contracts/product.view.js";
import { OpenAPI } from "routing-controllers-openapi";
import { SearchQuery } from "../../contracts/search.query.js";
import { RequestExt } from "../../utils/request.extension.js";
import { getFridgeProductList } from "./handlers/getFridgeProductList.handler.js";
import { transferFridgeProducts } from "./handlers/transferFridgeProducts.js";

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
    @Get("/:fridgeName")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Get all products from frige with given name, belonging to user with given ID"})
    @Authorized()
    async getFridgeProducts(@Param("fridgeName") fridgeName: string,
                            @Query() query: SearchQuery,
                            @Req() {token}: RequestExt){
    
        return getFridgeProductList(token.userId, fridgeName, query);
    }
    
    @Patch("/:fridgeName/receiver/:receiverId")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Transfer all products within given fridge"})
    @Authorized()
    async transferFridge(@Param("receiverId") receiverId: string,
                        @Param("fridgeName") fridgeName: string,
                        @Req() {token}: RequestExt){
        return transferFridgeProducts(token.userId,receiverId,fridgeName);
    }
}