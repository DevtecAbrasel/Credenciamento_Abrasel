import { DataTypes } from "sequelize";

import { sqliteConnection } from "#databases/sqlite.db.js";
import { Invitee } from "#interfaces/invitee.interface.js";

export const InviteeModel = Invitee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cellphone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "invitee",
    modelName: "Invitee",
    schema: "checkin",
    sequelize: sqliteConnection,
  }
);
