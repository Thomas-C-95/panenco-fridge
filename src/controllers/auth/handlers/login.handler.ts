import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";
import { LoginBody } from "../../../contracts/login.body.js";
import { Unauthorized, createAccessToken } from "@panenco/papi";

export const login = async (body: LoginBody) => {

    const em = RequestContext.getEntityManager();

    const user = await em.findOneOrFail(User, {'email': body.email});

    if (user.password !== body.password) {
        throw new Unauthorized("invalidCredentials", 'Invalid credentials');
    }

    const token = await createAccessToken('validationstring', 600, {userId: user.id});

    return  token;

}