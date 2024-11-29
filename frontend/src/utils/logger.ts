class Logger {
  error(error: unknown) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export const logger = new Logger();
