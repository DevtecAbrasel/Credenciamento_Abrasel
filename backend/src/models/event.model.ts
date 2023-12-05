import { DataTypes } from "sequelize";

import { sqliteConnection } from "#databases/sqlite.db.js";
import { Event } from "#interfaces/event.interface.js";
import { InviteeModel } from "#models/invitee.model.js";

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
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    finish: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "event",
    modelName: "Event",
    schema: "checkin",
    sequelize: sqliteConnection,
  }
);

EventModel.belongsToMany(InviteeModel, {
  through: "event_invitee",
  uniqueKey: "eventId",
  foreignKey: "eventId"
});

InviteeModel.belongsToMany(EventModel, {
  through: "event_invitee",
  uniqueKey: "inviteeId",
  foreignKey: "inviteeId"
});