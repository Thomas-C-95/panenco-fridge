import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { ProductView } from "../../contracts/product.view.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { getProductList } from "./handlers/getProductList.handler.js";
import { ProductBody } from "../../contracts/product.body.js";

import { getProduct } from "./handlers/getProduct.handler.js";
import { createProduct } from "./handlers/createProduct.handler.js";
import { RequestExt } from "../../utils/request.extension.js";
import { storeProduct } from "./handlers/storeProduct.handler.js";
import { deleteProduct } from "./handlers/deleteProduct.handler.js";
import { transferAllProducts } from "./handlers/transferAllProducts.handler.js";
import { transferProduct } from "./handlers/transferProduct.handler.js";

@JsonController("/products")
export class ProductController{

    // Get Products
    @Get("/")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Get list of all products belonging to user with given ID"})
    @Authorized()
    async getProducts(@Query() query: SearchQuery,
                      @Req() {token}: RequestExt){
        return getProductList(token.userId, query);
    }

    @Post("/")
    @Representer(ProductView, StatusCode.created)
    @OpenAPI({summary: "Create a new product for user with given ID"})
    @Authorized()
    async buyProduct(@Body() body: ProductBody){
        return createProduct(body);
    }

    @Get("/:productName")
    @Representer(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Get product with given ID, belonging to user with given ID"})
    @Authorized()
    async getProduct(@Param("productName") productName: string,
                     @Req() {token}: RequestExt){
        return getProduct(token.userId, productName);
    }

    @Patch("/:productName/fridges/:fridgeName")
    @Representer(null, StatusCode.ok)
    @OpenAPI({summary: "Store product with given ID in fridge with given name"})
    @Authorized()
    @Representer(null, StatusCode.noContent)
    async store(@Param("productName") productName: string,
                @Param("fridgeName") fridgeName: string,
                @Req() {token}: RequestExt
                ){
        return storeProduct(token.userId, productName, fridgeName);
    }

    @Delete("/:productName/fridges/:fridgeName")
    @Representer(null, StatusCode.noContent)
    @OpenAPI({summary: "Delete specific product for fridge with given name"})
    @Authorized()
    async deleteProduct(@Param("productName") productName: string,
                        @Param("fridgeName") fridgeName: string,
                        @Req() {token}: RequestExt){
        
        return deleteProduct(token.userId, productName, fridgeName);

    }

    // Transfer Products
    @Patch("/receiver/:receiverId")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "transfer all products belonging to owner"})
    @Authorized()
    async transferAllProducts(@Param("receiverId") receiverId: string,
                              @Req() {token}: RequestExt){
        return transferAllProducts(token.userId, receiverId)
    }

    @Patch("/:productName/receiver/:receiverId/")
    @Representer(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Transfer specific product"})
    @Authorized()
    async transferProduct(@Param("receiverId") receiverId: string,
                          @Param("productName") productName: string,
                          @Req() {token}: RequestExt){
        return transferProduct(token.userId, receiverId, productName);
    }
    

}