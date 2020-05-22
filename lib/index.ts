import cls from "cls-hooked";
import { v4 as uuid } from "uuid";

const logLevels: Record<string, number> = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
}

const logLevel = logLevels[process.env.LOG_LEVEL || ""] || logLevels.info;

const namespace = 'lesley';
const ns = cls.createNamespace(namespace);

function buildMessage(level: string, message: string, extra?: Record<string, any>): logMessage {
  let log = {
    message,
    extra: prepareForLogging(extra),
    time: (new Date).toISOString(),
    correlationId: cls.getNamespace(namespace).get('correlationId'),
    level,
  }

  if (extra?.correlationId) {
    log.correlationId = extra.correlationId;
    extra.correlationId = undefined;
  }

  if (extra?.error) {
    Object.assign(log, {error: enumerateError(extra.error)});
    extra.error = undefined;
  }

  return log;
}

function enumerateError(error: Error) {
  return Object.assign({
    message: error.message,
    stack: error.stack
  }, error);
}

function prepareForLogging(extra: Record<string, any>) {
  const ommitedInLogs = [
    "forename",
    "surname",
    "email",
    "password",
  ];
  return omit(extra, ommitedInLogs);
}

function omit<T extends object>(data: T, toOmit: string[]): { [k in Exclude<keyof T, string>]: T[k] } {
  if (!data) return data;
  let result: T = { ...data };
  Object.keys(data).forEach((key: string) => {
    if (toOmit.includes(key)) {
      delete result[key];
      return;
    }
  })
  return result;
}

function log(level: "info" | "debug" | "warn" | "error" | "fatal", message: string, extra?: Record<string, any>) {
  if (logLevel <= logLevels[level]) {
    const m = JSON.stringify(buildMessage(level, message, extra));
    process.stdout.write(`${m}\n`);
  }
}

export function debug(message: string, extra?: Record<string, any>) { log("debug", message, extra) }
export function info(message: string, extra?: Record<string, any>) { log("info", message, extra) }
export function warn(message: string, extra?: Record<string, any>) { log("warn", message, extra) }
export function error(message: string, extra?: Record<string, any>) { log("error", message, extra) }
export function fatal(message: string, extra?: Record<string, any>) { log("fatal", message, extra) }

export function bindExpressMiddleware(req: any, res: any, next: any) {
  ns.bindEmitter(req);
  ns.bindEmitter(res);
  ns.run(() => {
    const correlationId = req.header("x-correlation-id") || uuid();
    cls.getNamespace(namespace).set("correlationId", correlationId);
    next();
  });
}

export function bindFunction(func: Function, correlationId: string = ""): any {
  return ns.bind(function () {
    cls.getNamespace(namespace).set("correlationId", correlationId || uuid());
    return func.apply(null, arguments);
  });
}

export function getCorrelationId(): string {
  return cls.getNamespace(namespace).get('correlationId');
}

interface logMessage {
  time: string;
  level: string;
  message: string;
  extra: Record<string, any>;
  correlationId: string;
}

export default {
  debug,
  info,
  warn,
  error,
  fatal,
  bindExpressMiddleware,
  bindFunction,
  getCorrelationId,
}