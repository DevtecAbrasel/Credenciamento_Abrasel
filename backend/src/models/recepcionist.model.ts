import { DataTypes } from "sequelize";
import { sqliteConnection } from "#databases/sqlite.db.js";
import { Recepcionist } from "#interfaces/recepcionist.interface.js";

export const RecepcionistModel = Recepcionist.init(
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
    cellphone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Event (1-N) Recepcionist (Since every login is Unique)
  },
  {
    tableName: "recepcionist",
    modelName: "Recepcionist",
    sequelize: sqliteConnection,
  }
);
