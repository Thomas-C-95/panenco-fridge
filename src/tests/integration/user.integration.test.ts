import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import supertest from "supertest";
import { App } from "../../app.js";
import { User } from "../../entities/user.entity.js";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import { Product } from "../../entities/product.entity.js";
import { Fridge } from "../../entities/fridge.entity.js";
import { LoginBody } from "../../contracts/login.body.js";

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
                name: "spaghetti"
            } as Product;

            const {body: createProductResponse} = await request
            .post(`/api/users/${createUserResponse.id}/products`)
            .send({
                ...newProduct
            })
            .set('x-auth', token)
            .expect(StatusCode.created);

            // Store Product
            const {body: storeProductResponse} = await request
            .patch(`/api/users/${createUserResponse.id}/products/${createProductResponse.id}/fridges/${fridge.name}`)
            .set('x-auth', token)
            .expect(StatusCode.ok);

            // Get Product
            const {body: getProductResponse} = await request
            .get(`/api/users/${createUserResponse.id}/products/${createProductResponse.id}`)
            .set('x-auth', token)
            .expect(StatusCode.ok);

            const foundCreatedProduct = await em.findOne(Product, {id: createProductResponse.id});
            expect(foundCreatedProduct.name).to.equal(newProduct.name);
            await foundCreatedProduct.fridge.init();
            expect(foundCreatedProduct.fridge[0].name).to.equal(fridge.name);
            expect(foundCreatedProduct.owner.id).to.equal(createUserResponse.id);

            // Create second user
            const seconduser = {
                name: "seconduser",
                email: "seconduser@panenco.com",
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
            .patch(`/api/users/transfer/${createUserResponse.id}/${createSecondUserResponse.id}/products/${createProductResponse.id}`)
            .set('x-auth', token)
            .expect(StatusCode.ok);

            const em2 = orm.em.fork();
            const foundGiftedProduct = await em2.findOne(Product, {id: createProductResponse.id});
            expect(foundGiftedProduct.owner.id).to.equal(createSecondUserResponse.id);

            // Delete Product
            const {body: deleteProductResponse} = await request
            .delete(`/api/users/${createSecondUserResponse.id}/products/${createProductResponse.id}/fridges/${fridge.name}`)
            .set('x-auth', token)
            .expect(StatusCode.noContent);
            
            const em3 = orm.em.fork();
            const foundDeletedProduct = await em3.findOne(Product, {id: createProductResponse.id});

            if (!foundDeletedProduct){
                return;
            }
            // Get Product
            try{
                const {body: getDeletedProductResponse} = await request
                .get(`/api/users/${createSecondUserResponse.id}/products/${createProductResponse.id}`)
                .set('x-auth', token)
                .expect(StatusCode.ok);
                console.log(getDeletedProductResponse.name);
            } catch(error){
                expect(error.message).to.equal("Product NotFound");
                return;
            }
            expect(true, "Getting deleted product should have thrown an error").to.equal(false);
            return;
        });
    });
});