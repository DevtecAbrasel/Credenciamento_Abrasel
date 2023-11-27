export function exceptionHandler(error: any, _: any, res: any, next: any) {
  if (!(error instanceof Error)) {
    console.error(`Exceção de tipo inesperado lançada: ${error}`);
  }
  // Passar o erro para o hadnler padrão do express se os headers da resposta já estiverem escritos.
  // Comportamento requisitado no guia do express, ref: https://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    return next(error);
  }

  console.error(error.stack.constructor === Array ? error.stack.join("\n") : error.stack);

  // Para situações como os erros do Sequelize, nos quais não aparece a mensagem de erro na propriedade normal.
  if (error.original) {
    console.error(`Extended error message: ${error.original.stack}`);
  }

  res.status(500).send({
    error: {
      name: error.name,
      message: `Erro interno encontrado: ${error.message}`,
    },
  });
}
