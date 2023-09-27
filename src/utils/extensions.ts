import { Dictionary } from '@mikro-orm/core';
// import { IPrimaryKeyValue } from '@mikro-orm/core/src/typings';
import { IPrimaryKey } from '@mikro-orm/core';
import { NotFound } from '@panenco/papi';

export const noEntityFoundError = function (entityName: string, where: Dictionary<any> | IPrimaryKey): Error {
	throw new NotFound(`entityNotFound`, `${entityName} ${NotFound.name}`);
};