import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity.js";
import { FridgeBody } from "../../../contracts/fridge.body.js";

export const create = async (body: FridgeBody) => {
    const em = RequestContext.getEntityManager();
    const fridge = em.create(Fridge, body);
    await em.persistAndFlush(fridge);
    return fridge;
}