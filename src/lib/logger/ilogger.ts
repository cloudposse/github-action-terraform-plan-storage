export interface ILogger {
  debug(message: string): void;
  info(message: string): void;
  error(message: string | Error): void;
}
