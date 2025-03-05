import { DataTypes } from "sequelize";
import sequelize from "../db.ConfigSequelize/connection.js";

const faculty = sequelize.define('faculty' , {
    id : { type : DataTypes.INTEGER , primaryKey : true , autoIncrement : true} ,
    facultyNumber : { type : DataTypes.STRING , allowNull : false , unique: true} ,
    name : { type : DataTypes.STRING } ,
    email : { type : DataTypes.STRING , unique: true, allowNull : false},
    password : { type : DataTypes.STRING } ,
    isVerified : { type : DataTypes.ENUM('true' , 'false') , default : 'false' },
} , { timestamps : false });

export default faculty;