import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { FridgeBody } from "../../contracts/fridge.body.js";
import { UserBody } from "../../contracts/user.body.js";
import { User } from "../../entities/user.entity.js";
import ormConfig from "../../orm.config.js";
import { RequestContext } from "@mikro-orm/core";
import { getUser } from "../../controllers/users/handlers/getUser.handler.js";
import { expect } from "chai";
import { createUser } from "../../controllers/users/handlers/createUser.handler.js";
import { Product } from "../../entities/product.entity.js";
import { ProductBody } from "../../contracts/product.body.js";
import { buyProduct } from "../../controllers/users/handlers/buyProduct.handler.js";
import { getProduct } from "../../controllers/product/handlers/getProduct.handler.js";
import { getProductList } from "../../controllers/product/handlers/getProductList.handler.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { transferProduct } from "../../controllers/product/handlers/transferProduct.handler.js";
import { transferAllProducts } from "../../controllers/product/handlers/transferAllProducts.handler.js";
import { Fridge } from "../../entities/fridge.entity.js";
import { storeProduct } from "../../controllers/product/handlers/storeProduct.handler.js";
import { getFridgeProductList } from "../../controllers/fridges/handlers/getFridgeProductList.handler.js";
import { deleteProduct } from "../../controllers/product/handlers/deleteProduct.handler.js";
import { Recipe } from "../../entities/recipe.entity.js";
import { RecipeBody } from "../../contracts/recipe.body.js";
import { getRecipeList } from "../../controllers/users/handlers/getRecipeList.handler.js";
import { deleteRecipe } from "../../controllers/users/handlers/deleteRecipe.handler.js";
import { createRecipe } from "../../controllers/users/handlers/createRecipe.handler.js";
import exp from "constants";
import { getRecipe } from "../../controllers/users/handlers/getRecipe.handler.js";
import { updateRecipe } from "../../controllers/users/handlers/updateRecipe.handler.js";
import { updateMissingIngredients } from "../../controllers/users/handlers/updatedMissingIngredients.handler.js";
import { ProductQuantity } from "../../entities/product.quantity.entity.js";
import { createProduct } from "../../controllers/product/handlers/createProduct.handler.js";

const userFixtures: UserBody[] = [
    {
        name: "first user",
        email: "firstuser.@panenco.com",
        password: "password"
    } as UserBody,
    {
        name: "second user",
        email: "second.user@panenco.com",
        password: "password2"
    } as UserBody
]
const fridgeFixtures: FridgeBody[] = [
    {
        name: "kitchen",
        location: "first floor",
        capacity: 100
    } as FridgeBody,
    {
        name: "office",
        location: "second floor",
        capacity: 0
    } as FridgeBody
]
const productFixtures: ProductBody[] = [
    {
        name: "milk",
        size: 3
    } as ProductBody,
    {
        name: "bread",
        size: 5
    } as ProductBody,
]
const recipeFixtures: RecipeBody[] = [
    {
        name: "milkshake",
        description: "yummy milkshake",
        ingredients: {
            "milk": 1,
            "icecream": 1
        }
    } as RecipeBody,
    {
        name: "pancake",
        description: "yummy pancake",
        ingredients:{
            "milk": 1,
            "flour": 1,
            "eggs": 1
        }
    }
]
const productQuantityFixtures: ProductQuantity[] = [
    {   
        id: 1,
        quantity: 1
    } as ProductQuantity,
    {
        id: 2,
        quantity: 2
    } as ProductQuantity
]

describe('Handler tests', () => {
    describe('User tests',()=> {
        let orm: MikroORM<PostgreSqlDriver>;
        let users: User[];

        before( async () => {
            orm = await MikroORM.init(ormConfig);
        });

        beforeEach( async () => {
            await orm.em.execute('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
            await orm.getMigrator().up();
            const em = orm.em.fork();
            users = userFixtures.map( x => em.create(User, x))
            await em.persistAndFlush(users);
        });
        it("should get users by id", async () => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const res = await getUser(users[0].id);
                expect(res.name === users[0].name).true;
            });

        });
        it("should create a new user", async () => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const newuser  = {
                    name: "new user",
                    email: "newuser@panenco.com",
                    password: "password"
                } as UserBody;
                const res = await createUser(newuser);
                expect(res.name === newuser.name).true;
                expect(res.email === newuser.email).true;
                
            });
        });

    })
    describe('Product Tests', ()=> {
        let orm: MikroORM<PostgreSqlDriver>;
        let users: User[];
        let products: Product[];
        let fridges: Fridge[];
        let productQuantities: ProductQuantity[];
        before( async () => {
            orm = await MikroORM.init(ormConfig);
        });
        beforeEach( async () => {
            await orm.em.execute('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
            await orm.getMigrator().up();

            const em = orm.em.fork();
            users = userFixtures.map( x => em.create(User, x));
            products = productFixtures.map( x => em.create(Product, x));
            fridges =  fridgeFixtures.map( x => em.create(Fridge, x));
            productQuantities =  productQuantityFixtures.map( x => em.create(ProductQuantity, x));
            users[0].products.add(productQuantities)
            fridges[0].contents.add(productQuantities);
            products[0].owner.add(productQuantities[0]);
            products[1].owner.add(productQuantities[1]);
            await em.persistAndFlush(users, products, fridges, productQuantities);        
        });
        it("should get products by Name", async () => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const res = await getProduct(users[0].id, products[0].name);
                expect(res.name === products[0].name).true;
            });
        });
        it("should get all products of a user if no query specified", async () => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const query = {
                    search: undefined
                } as SearchQuery;
                const res = await getProductList(users[0].id, query);
                expect(res.length===products.length).true;
            });
        });
        it("should get all products matching given query", async () => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const query = {
                    search: "kitchen"
                } as SearchQuery;
                const [res, count] = await getProductList(users[0].id, query);
                expect(count).to.be.equal(2);
            });
        
        });
        it("should create a new product", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const newProduct = {
                    name: "meat",
                    size: 15
                } as ProductBody;
                const res = await createProduct(newProduct);
                expect(res.name === newProduct.name).true;
            });
        });
        it("should transfer products between users", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const res = await transferProduct(users[0].id, users[1].id, products[0].name);
                const prod = await getProduct(users[1].id, products[0].name);
                expect(prod.name === products[0].name).true;
            });
        });
        it("should transfer all products between users", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const res = await transferAllProducts(users[0].id, users[1].id);
                const query = {
                    search: undefined
                } as SearchQuery;
                const [ownerproducts, ownercount] = await getProductList(users[0].id, query); 
                const [receiverproducts, receivercount] = await getProductList(users[1].id, query); 
                expect(ownercount === 0).true;
                expect(receivercount === products.length).true;
            });
        });

    });
    describe("Fridge tests", () =>{
        let orm: MikroORM<PostgreSqlDriver>;
        let users: User[];
        let products: Product[];
        let fridges: Fridge[];
        let productQuantities: ProductQuantity[];

        before( async() => {
            orm = await MikroORM.init(ormConfig);    
        });
        beforeEach( async() => {
            await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public`);
            await orm.getMigrator().up();
            const em = orm.em.fork();

            users = userFixtures.map( x => em.create(User, x));
            fridges = fridgeFixtures.map (x => em.create(Fridge, x));
            products = productFixtures.map( x => em.create(Product, x));
            
            productQuantities =  productQuantityFixtures.map( x => em.create(ProductQuantity, x));
            users[0].products.add(productQuantities)
            fridges[0].contents.add(productQuantities);
            products[0].owner.add(productQuantities[0]);
            products[1].owner.add(productQuantities[1]);
            
            await em.persistAndFlush(users, products, fridges, productQuantities);  
        });
        it ("should store a product in a fridge", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const em1 = RequestContext.getEntityManager();
                const countbefore = (await em1.findOne(ProductQuantity, {location: {name: fridges[0].name}})).quantity;
                const res = await storeProduct(users[0].id, products[0].name, fridges[0].name);
                const em2 = RequestContext.getEntityManager();
                const countafter = (await em2.findOne(ProductQuantity, {location: {name: fridges[0].name}})).quantity;
                console.log("countbefore: ", countbefore);
                console.log("countafter: ", countafter);
                expect(countafter === countbefore + 1).true;
            });
        });
        it ("should fail to store a product if fridge is full", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                try{
                    const res = await storeProduct(users[0].id, products[0].name, fridges[1].name);
                } catch(error){
                    expect(error.message).equal('Fridge is full');
                    return;
                }
                expect(true, "Get storing product should have raised an error").false;
            });
        });
        it ("should return a list of all products in a fridge", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const query = {
                    search: undefined
                } as SearchQuery;
                const [res, count] = await getFridgeProductList(users[0].id, fridges[0].name, query);
                expect(count === 2).true;
            });
        });
        it ("should delete a product from a fridge", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const em1 = RequestContext.getEntityManager();
                const countbefore = (await em1.findOne(ProductQuantity, {product: {name: products[1].name}})).quantity;
                await deleteProduct(users[0].id, products[1].name, fridges[0].name);
                const em2 = RequestContext.getEntityManager();
                const countafter = (await em2.findOne(ProductQuantity, {product: {name: products[1].name}})).quantity;
                expect(countbefore === countafter+1).true;
            });
        });
    });
    describe("Recipe tests", ()=> {
        let orm: MikroORM<PostgreSqlDriver>;
        let users: User[];
        let recipes: Recipe[];

        before( async() => {
            orm = await MikroORM.init(ormConfig);    
        });
        beforeEach( async() => {
            await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public`);
            await orm.getMigrator().up();
            const em = orm.em.fork();

            users = userFixtures.map( x => em.create(User, x));
            recipes = recipeFixtures.map (x => em.create(Recipe, x));

            users[0].recipes.add(recipes);
            await em.persistAndFlush(users, recipes);
        });
        it ("should return a list of all recipes", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const [res, count] = await getRecipeList(users[0].id);
                expect(count === recipes.length).true;
            });
        });
        it ("should return a recipe by name", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const res = await getRecipe(users[0].id, recipes[0].name);
                expect(res.name === recipes[0].name).true;
                expect(res.description === recipes[0].description).true;
                expect(res.ingredients).to.deep.equal(recipes[0].ingredients);
            });
        });
        it ("should delete a recipe", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const lengthBefore = recipes.length;
                await deleteRecipe(users[0].id, recipes[0].name);
                const [ __, lengthAfter] = await getRecipeList(users[0].id);
                expect(lengthBefore === lengthAfter + 1).true;
            });
        });
        it ("should create a new recipe", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const lengthBefore = recipes.length;
                const newRecipe = {
                    name: "cake",
                    description: "yummy cake",
                    ingredients: {
                        "flour": 1,
                        "eggs": 1,
                        "sugar": 1,
                        "chocolate": 1
                    }
                } as RecipeBody;
                const res = await createRecipe(users[0].id, newRecipe);
                const [ __, lengthAfter] = await getRecipeList(users[0].id);
                expect(lengthAfter === lengthBefore + 1).true;
                expect(res.name === newRecipe.name).true;
                expect(res.description === newRecipe.description).true;
            });
        });
        it("should update a recipe", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const recipeUpdate = {
                    "description": "yummy milkshake with icecream",
                } as RecipeBody;
                recipeUpdate.ingredients = {"milk": 1, "icecream": 2, "vanilla":3}
                const res = await updateRecipe(users[0].id, recipes[0].name, recipeUpdate);
                const resConfirmation = await getRecipe(users[0].id, recipes[0].name);
                
                expect(res.description === recipeUpdate.description).true;
                expect(resConfirmation.description === recipeUpdate.description).true;
                expect(resConfirmation.ingredients).to.deep.equal(recipeUpdate.ingredients);
            });
        });
        it("should update products to include all missing ingredients for a recipe", async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                const res = await updateMissingIngredients(users[0].id, recipes[0].name);
                const [products, count] = await getProductList(users[0].id, {search: undefined});
                expect(products.some((x)=> x.name === "icecream")).true;
                expect(products.some((x)=> x.name === "milk")).true;
            });
        });
    });
})
