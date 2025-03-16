import { DataTypes } from "sequelize";
import Sequelize from "../db.ConfigSequelize/connection.js";
import event from "./event.model.js";
import student from "./student.model.js";


const EventRegistration  = Sequelize.define(`revents`, {
                                    
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        branch: {type: DataTypes.STRING , allowNull:false}  ,
        number: {type:DataTypes.BIGINT , allowNull:false},
        eventId: { 
            type: DataTypes.INTEGER,  
            allowNull: false,  
            references: { model: event, key: "id" }  // Correct foreign key reference
        },
        rollNumber: {
            type : DataTypes.STRING,
            allowNull : false ,
            references: { model:student , key:'rollNumber'}
        }
    }, {
        timestamps: true
    }); 

export default EventRegistration;