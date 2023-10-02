import { RequestContext } from "@mikro-orm/core";


export class RequestExt extends Request{

    public em = RequestContext.getEntityManager();

    public token: any;
}