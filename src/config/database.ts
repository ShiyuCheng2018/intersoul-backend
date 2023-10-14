import { Sequelize } from 'sequelize';
import {initModels} from "../models/init-models";
import {Dialect} from "sequelize/types/sequelize";
import dotenv from 'dotenv';
dotenv.config();

const DATABASE = process.env.DATABASE as string;
const USERNAME = process.env.USERNAME as string;
const PASSWORD = process.env.PASSWORD as string;
const DATABASE_HOST = process.env.DATABASE_HOST as string;
const DATABASE_DIALECT = process.env.DATABASE_DIALECT as Dialect;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
    logging: (msg) => {
        if (msg.includes("ERROR")) {
            console.log(msg);
        }
    },
    define: {
        underscored: true, // convert snake_case column names to camelCase
    }
});
initModels(sequelize);
export default sequelize;