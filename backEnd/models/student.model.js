import { DataTypes } from "sequelize";
import sequelize from "../db.ConfigSequelize/connection.js";

const student = sequelize.define('student' , {
    id : { type : DataTypes.INTEGER , primaryKey : true , autoIncrement : true} ,
    rollNumber : { type : DataTypes.STRING , unique: true} ,
    name : { type : DataTypes.STRING } ,
    email : { type : DataTypes.STRING , unique: true, allowNull : false},
    password : { type : DataTypes.STRING } ,
    isVerified : { type : DataTypes.ENUM('true' , 'false') , default : 'false' },
} , { timestamps : false });

export default student;