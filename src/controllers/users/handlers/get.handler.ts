import { RequestContext } from "@mikro-orm/core"
import { User } from "../../../entities/user.entity.js";

export const get = async(id: string) => {

    const em = RequestContext.getEntityManager();
    const user = await em.findOne(User, {id}); // Switch to find on or fail

    return user;
}