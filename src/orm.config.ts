import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as url from "node:url";
import path from 'node:path';

import config from './config.js';
import { noEntityFoundError } from './utils/extensions.js';
// import { noEntitiyFoundError } from './utils/extensions.js'; //Have to complete this still

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  debug: true,
  migrations: {
    path: path.join(__dirname, "migrations"),
    tableName: "migrations",
    transactional: true,
    pattern: /^[\w-]+\d+\.(ts|js)$/,
    disableForeignKeys: false,
    emit: "ts",
  },
  type: "postgresql",
  entities: [path.join(process.cwd(), "**", "*.entity.js")],
  user: config.postgres.user,
  password: config.postgres.password,
  dbName: config.postgres.db,
  host: config.postgres.host,
  port: config.postgres.port,
  ssl: false,
  findOneOrFailHandler: noEntityFoundError
} as Options<PostgreSqlDriver>;
// findOneOrFailHandler: noEntitiyFoundError, // Add to options if function is defined