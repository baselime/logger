import winston from "winston";

const log = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: './logs/combined.log',
      level: 'info'
    }),
    new winston.transports.File({
      filename: './logs/errors.log',
      level: 'error'
    }),
    new winston.transports.Console()
  ]
});

interface ILogMessage {
  message: string,
  data: Object,
  correlationId: string,
  error?: any,
}


const logger = {
  error: (o: ILogMessage) => log.error({ message: JSON.stringify(o) }),
  warn: (o: ILogMessage) => log.warn({ message: JSON.stringify(o) }),
  info: (o: ILogMessage) => log.info({ message: JSON.stringify(o) }),
  verbose: (o: ILogMessage) => log.verbose({ message: JSON.stringify(o) }),
  debug: (o: ILogMessage) => log.debug({ message: JSON.stringify(o) }),
  silly: (o: ILogMessage) => log.silly({ message: JSON.stringify(o) }),
}

export default logger;
