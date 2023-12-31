import { Sequelize } from "sequelize";

export const sqliteConnection = new Sequelize({
  dialect: "sqlite",
  storage: "./sqlite/credenciamento.sqlite",
  logging: false,
  query: {
    raw: true
  }
});
