/**
 * Wrapper para os middlewares assíncronos repassarem as exceções para o próximo da sequência.
 *
 */
export function asyncWrapper(fn: any) {
  return function (req: any, res: any, next: any) {
    fn(req, res, next).catch((error: any) => next(error));
  };
}
