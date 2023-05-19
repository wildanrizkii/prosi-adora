import session from "next-session";
import MySQLStore from "express-mysql-session";
import { dbConfig } from "../next.config";
import { promisifyStore, expressSession } from "next-session/lib/compat";

const Store = MySQLStore(expressSession);

const Options = {
  host: dbConfig.MYSQL_HOST,
  port: 3306,
  user: dbConfig.MYSQL_USER,
  password: dbConfig.MYSQL_PASSWORD,
  database: dbConfig.MYSQL_DATABASE,
};

export const sessionStore = new Store(Options);

export const getSession = session({
  store: promisifyStore(sessionStore),
  cookie: {
    maxAge: 60000,
  },
  name: "idAdora",
});
