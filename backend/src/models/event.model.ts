import { sqliteConnection } from "#databases/sqlite.db.js";
import { Event } from "#interfaces/event.interface.js";
import { DataTypes } from "sequelize";

export const EventModel = Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    finish: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "event",
    modelName: "Event",
    schema: "public",
    sequelize: sqliteConnection,
  }
);