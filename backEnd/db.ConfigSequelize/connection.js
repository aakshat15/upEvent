// Sequelize is a Node.js ORM (Object-Relational Mapper)
import dotenv from "dotenv";

dotenv.config();

import { Sequelize } from "sequelize";
const sequelize = new Sequelize(`${process.env.DBNAME}`, `${process.env.DBUSER}`, `${process.env.DBPASS}`, {
    host: "localhost",
    dialect: "mysql" ,  
    logging: false,
}    
);


export default sequelize;