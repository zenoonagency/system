import { HttpError, TimeoutError, NetworkError } from '../services/http/errors';

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message;
  }
  
  if (error instanceof TimeoutError) {
    return 'A operação demorou muito para responder. Por favor, tente novamente.';
  }
  
  if (error instanceof NetworkError) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}