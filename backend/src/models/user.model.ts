import { DataTypes } from "sequelize";
import { sqliteConnection } from "../databases/sqlite.db.js";
import { User } from "../interfaces/user.interface.js";

export const UserModel = User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "user",
    modelName: "User",
    sequelize: sqliteConnection
});