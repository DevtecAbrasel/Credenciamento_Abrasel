import { DataTypes } from "sequelize";

import { sqliteConnection } from "#databases/sqlite.db.js";
import { Recepcionist } from "#interfaces/recepcionist.interface.js";
import { EventModel } from "#models/event.model.js";

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
      unique: "login",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Event (1-N) Recepcionist (Since every login is Unique)
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "login",
      references: {
        model: EventModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "recepcionist",
    modelName: "Recepcionist",
    schema: "checkin",
    sequelize: sqliteConnection,
  }
);

EventModel.hasMany(RecepcionistModel, {
  foreignKey: {
    name: "eventId",
  },
});

Recepcionist.belongsTo(EventModel, {
  foreignKey: {
    name: "eventId",
  },
});
