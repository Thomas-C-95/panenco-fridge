import { RequestContext } from "@mikro-orm/core"
import { User } from "../../../entities/user.entity.js";

export const getUser = async(id: string) => {

    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, {id}); // Switch to find on or fail

    return user;
}