/** 
 * Junta o wrappers utilizados nas funções de callback das rotas do express, para fazer uso de funcionalidades comums.
*/
import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import { transactionWrapper } from "#middlewares/transaction-wrapper.middleware.js";

export const composedWrapper = (fn:any) => {
  return asyncWrapper(transactionWrapper(fn));
}