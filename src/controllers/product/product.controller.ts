import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { Authorized, Get, JsonController, Param, Post } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { ProductView } from "../../contracts/product.view.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { getProductList } from "./handlers/getProductList.handler.js";
import { ProductBody } from "../../contracts/product.body.js";

import { getProduct } from "./handlers/getProduct.handler.js";
import { createProduct } from "./handlers/createProduct.handler.js";


@JsonController("/products")
export class ProductController{

    // Get Products
    @Get("/:id")
    @ListRepresenter(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Get list of all products belonging to user with given ID"})
    @Authorized()
    async getProducts(@Param("id") id: string,
                      @Query() query: SearchQuery){
        return getProductList(id, query);
    }

    @Post("/:id")
    @Representer(ProductView, StatusCode.created)
    @OpenAPI({summary: "Create a new product for user with given ID"})
    @Authorized()
    async buyProduct(@Param("id") id: string,
                     @Body() body: ProductBody){
        return createProduct(body);
    }

    @Get("/:id/:productId")
    @Representer(ProductView, StatusCode.ok)
    @OpenAPI({summary: "Get product with given ID, belonging to user with given ID"})
    @Authorized()
    async getProduct(@Param("id") id: string,
                     @Param("productId") productId: string){
        return getProduct(id, productId);
    }

}