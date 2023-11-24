/**
 * Wrapper para os middlewares assíncronos repassarem as exceções para o próximo da sequência.
 *
 */
export function asyncWrapper(fn: any) {
  return async function (req: any, res: any, next: any) {
    try {
      return await fn(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
}
