import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import supertest from "supertest";
import { App } from "../../app.js";
import { User } from "../../entities/user.entity.js";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import { Product } from "../../entities/product.entity.js";
import { Fridge } from "../../entities/fridge.entity.js";
import { LoginBody } from "../../contracts/login.body.js";
import { ProductQuantity } from "../../entities/product.quantity.entity.js";

const fridgeFixture: Fridge = {
    name: 'funnyfridge',
    location: "kitchen",
    capacity: 100
} as Fridge;

describe("Integration Test", () => {
    describe("Create Product Test", () => {

        let request: supertest.SuperTest<supertest.Test>;
        let orm: MikroORM<PostgreSqlDriver>;
        let fridge: Fridge;

        before (async () => {
            const app = new App();
            await app.createConnection();
            orm = app.orm;
            request = supertest(app.host);
        });
        beforeEach(async () => {
            await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
            await orm.getMigrator().up();

            const em = orm.em.fork();
            fridge = em.create(Fridge, fridgeFixture);
            await em.persistAndFlush(fridge);
            
        });
        it("should create user and create, store, delete get product", async ()=> {

            // Create User
            const newuser = {
                name: "newuser",
                email: "newuser@panenco.com",
                role: "admin",
                password: "password"
            } as User;

            const {body: createUserResponse} = await request
            .post("/api/users")
            .send({
                ...newuser
            })
            .expect(StatusCode.created);

            const em = orm.em.fork();
            const foundCreatedUser = await em.findOne(User, {id: createUserResponse.id});
            expect(foundCreatedUser.name).to.equal(newuser.name);
            expect(foundCreatedUser.email).to.equal(newuser.email);
            // Login
            const loginInput = {email: newuser.email, password: newuser.password} as LoginBody;

            const {body: loginResponse} = await request
            .post("/api/auth/tokens")
            .send({...loginInput})
            .expect(StatusCode.ok);

            const token = loginResponse.token;            
            // Get User
            const {body: getUserResponse} = await request
            .get(`/api/users/${createUserResponse.id}`)
            .set('x-auth', token)
            .expect(StatusCode.ok);

            expect(getUserResponse.name).to.equal(newuser.name);
            expect(getUserResponse.email).to.equal(newuser.email);

            // Create Product
            const newProduct = {
                name: "spaghetti",
                size: 3
            } as Product;

            const {body: createProductResponse} = await request
            .post(`/api/products/`)
            .send({
                ...newProduct
            })
            .set('x-auth', token)
            .expect(StatusCode.created);

            // Store Product
            const {body: storeProductResponse} = await request
            .patch(`/api/products/${createProductResponse.name}/fridges/${fridge.name}`)
            .set('x-auth', token)
            .expect(StatusCode.ok);

            // Get Product
            const {body: getProductResponse} = await request
            .get(`/api/products/${createProductResponse.name}`)
            .set('x-auth', token)
            .expect(StatusCode.ok);

            const foundCreatedProduct = await em.findOne(ProductQuantity, {product: {id: getProductResponse.id}}, {populate: ['location', 'owner']});
            expect(getProductResponse.name).to.equal(newProduct.name);
            expect(foundCreatedProduct.location.name).to.equal(fridge.name);
            expect(foundCreatedProduct.owner.id).to.equal(createUserResponse.id);

            console.log("Get product succeeded")
            // Create second user
            const seconduser = {
                name: "seconduser",
                email: "seconduser@panenco.com",
                role: 'user',
                password: "password"
            } as User;

            const {body: createSecondUserResponse} = await request
            .post("/api/users")
            .send({
                ...seconduser
            })
            .set('x-auth', token)
            .expect(StatusCode.created);

            // Gift product to second user
            const {body: giftProductResponse} = await request
            .patch(`/api/products/${createProductResponse.name}/receiver/${createSecondUserResponse.id}`)
            .set('x-auth', token)
            .expect(StatusCode.ok);

            const em2 = orm.em.fork();
            const foundGiftedProduct = await em2.findOne(ProductQuantity, {product: {id: createProductResponse.id}});
            expect(foundGiftedProduct.owner.id).to.equal(createSecondUserResponse.id);

            // Login user 2
            const loginInput2 = {email: seconduser.email, password: seconduser.password} as LoginBody;
            const {body: loginResponse2} = await request
            .post("/api/auth/tokens")
            .send({...loginInput2})
            .expect(StatusCode.ok);

            const token2 = loginResponse2.token; 

            // Delete Product
            const {body: deleteProductResponse} = await request
            .delete(`/api/products/${createProductResponse.name}/fridges/${fridge.name}`)
            .set('x-auth', token2)
            .expect(StatusCode.noContent);

            console.log("Deleting product succeeded")

            // Get Product
            const {body: getDeletedProductResponse} = await request
            .get(`/api/products/${createProductResponse.name}`)
            .set('x-auth', token)
            .expect(StatusCode.notFound);
    
            return;
        });
    });
});