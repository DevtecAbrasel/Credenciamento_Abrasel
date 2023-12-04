import { DataTypes } from "sequelize";

import { sqliteConnection } from "#databases/sqlite.db.js";
import { Manager } from "#interfaces/manager.interface.js";

export const ManagerModel = Manager.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "manager",
    modelName: "Manager",
    schema: "checkin",
    sequelize: sqliteConnection,
  }
);
