export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === 'HttpError') {
      return error.message;
    }
    if (error.message === 'Tempo limite da requisição excedido') {
      return 'A operação demorou muito para responder. Por favor, tente novamente.';
    }
    if (error.message.includes('NetworkError') || error.message.includes('conexão')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
    return error.message;
  }
  return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}