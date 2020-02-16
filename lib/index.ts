import winston, { Logger, format } from "winston";

const enumerateError = (error: any) => {
  return Object.assign({
    message: error.message,
    stack: error.stack
  }, error);
}

const log = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 4,
  },
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    }),
    winston.format.json()
  ),
  transports: [
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
  error: (o: ILogMessage) => log.log({level: "error", message: prepareForLogging(o)}),
  warn: (o: ILogMessage) => log.warn(prepareForLogging(o)),
  info: (o: ILogMessage) => log.info(prepareForLogging(o)),
  verbose: (o: ILogMessage) => log.verbose(prepareForLogging(o)),
  debug: (o: ILogMessage) => log.debug(prepareForLogging(o)),
}

function prepareForLogging(message: ILogMessage) {
  const ommitedInLogs = [
    "forename",
    "surname",
    "email",
    "password",
  ];
  message.data = omit(message.data, ommitedInLogs);
  message.error = message.error ? enumerateError(message.error) : undefined;
  return JSON.stringify(message);
}

function omit<T extends object>(data: T, toOmit: string[]): { [k in Exclude<keyof T, string>]: T[k] } {
  if (!data) return data;
  let result: T = { ...data };
  Object.keys(data).forEach((key: string) => {
    if (toOmit.includes(key)) {
      delete result[key];
      return;
    }
    if (typeof result[key] === "object") {
      result[key] = omit(result[key], toOmit);
    }
  })
  return result;
}

export default logger;
