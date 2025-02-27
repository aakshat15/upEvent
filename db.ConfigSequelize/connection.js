// Sequelize is a Node.js ORM (Object-Relational Mapper)

import { Sequelize } from "sequelize";
const sequelize = new Sequelize('upEvent', 'root', 'akshat', {
    host: "localhost",
    dialect: "mysql" ,  
    logging: false,
}    
);


export default sequelize;