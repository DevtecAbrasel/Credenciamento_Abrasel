/**
 * Wrapper para encapsular o gerenciamento de transações por rota
 */
import { sqliteConnection } from "../databases/sqlite.db.js";

export function transactionWrapper(fn: any) {
  return async function (req: any, res: any, next: any) {
    const transaction = await sqliteConnection.transaction();
    try {
      const result = await fn(req, res, transaction, next);
      transaction.commit();
      return result;
    } catch (error: any) {
      await transaction.rollback();
      throw error;
    }
  };
}
