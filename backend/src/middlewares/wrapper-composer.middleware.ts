import { asyncWrapper } from "./async-wrapper.middleware.js";
import { transactionWrapper } from "./transaction-wrapper.middleware.js";

export const composedWrapper = (fn:any) => {
  return asyncWrapper(transactionWrapper(fn));
}