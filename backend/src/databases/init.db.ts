import { sqliteConnection } from "#databases/sqlite.db.js";

export const connectDatabase = async () => {
  try {
    await sqliteConnection.authenticate();
    //sqliteConnection.sync({ force: true })
  } catch (error: any) {
    console.error("Erro em conectar ao banco!", error);
  }
};

export const disconnectDatabase = async () => {
  try {
    await sqliteConnection.close();
  } catch (error: any) {
    console.error("Erro em desconectar do banco!", error);
  }
};
