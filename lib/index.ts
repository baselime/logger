import cls from "cls-hooked";
import { v4 as uuid } from "uuid";

const logLevels: Record<string, number> = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

let logLevel = logLevels[process.env.LOG_LEVEL || ""] || logLevels.info;

const namespace = 'baselime';
const ns = cls.createNamespace(namespace);

function buildMessage(level: string, message: string, extra?: Record<string, any>): logMessage {
  const log: logMessage = {
    message,
    extra: prepareForLogging(extra),
    time: (new Date).toISOString(),
    traceId: cls.getNamespace(namespace).get('traceId'),
    requestId: cls.getNamespace(namespace).get('requestId'),
    level,
  };

  if (extra?.traceId) {
    log.traceId = extra.traceId;
    extra.traceId = undefined;
  }

  if (extra?.requestId) {
    log.requestId = extra.requestId;
    extra.requestId = undefined;
  }

  if (extra?.error) {
    Object.assign(log, { error: enumerateError(extra.error) });
    extra.error = {};
    delete extra.error;
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

  if (typeof extra?.body === "object" && extra?.body !== null) {
    try {
      extra.body = JSON.stringify(extra.body);
    } catch (error) {
      extra.body = "There was an error parsing this in the logger";
    }
  }

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
  });
  return result;
}

function replacer() {
  const visited = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};


function log(level: "info" | "debug" | "warn" | "error" | "fatal", message: string, extra?: Record<string, any>) {
  if (logLevel <= logLevels[level]) {
    const data = buildMessage(level, message, extra);
    let m: string | logMessage = "";
    try {
      m = JSON.stringify(data, replacer());
    } catch(error) {
      m = JSON.stringify({
        time: data.time,
        level: data.level,
        message: data.message,
        traceId: data.traceId,
        requestId: data.requestId,
       });
    }
    if (level === "error" || level === "fatal") {
      return process.stderr.write(`${m}\n`);
    }
    process.stdout.write(`${m}\n`);
  }
}

export function debug(message: Capitalize<string>, extra?: Record<string, any>) { log("debug", message, extra); }
export function info(message: Capitalize<string>, extra?: Record<string, any>) { log("info", message, extra); }
export function warn(message: Capitalize<string>, extra?: Record<string, any>) { log("warn", message, extra); }
export function error(message: Capitalize<string>, extra?: Record<string, any>) { log("error", message, extra); }
export function fatal(message: Capitalize<string>, extra?: Record<string, any>) { log("fatal", message, extra); }

export function bindExpressMiddleware(req: any, res: any, next: any) {
  ns.bindEmitter(req);
  ns.bindEmitter(res);
  ns.run(() => {
    const traceId = req.header("x-trace-id") || uuid();
    const requestId = req.header("x-request-id") || uuid();
    cls.getNamespace(namespace).set("traceId", traceId);
    cls.getNamespace(namespace).set("requestId", requestId);
    next();
  });
}

export function bindFunction(func: Function, requestId: string = "", traceId: string = ""): any {
  return ns.bind(function () {
    cls.getNamespace(namespace).set("requestId", requestId || uuid());
    cls.getNamespace(namespace).set("traceId", traceId || uuid());
    return func.apply(null, arguments);
  });
}

export function getTraceId(): string {
  return cls.getNamespace(namespace).get('traceId');
}

export function getRequestId(): string {
  return cls.getNamespace(namespace).get('requestId');
}

export function enableDebug(): void {
  logLevel = logLevels.debug;
}

export function disableDebug(): void {
  logLevel = logLevels.info;
}

interface logMessage {
  time: string;
  level: string;
  message: string;
  extra: Record<string, any>;
  traceId: string;
  requestId: string;
}

export default {
  debug,
  info,
  warn,
  error,
  fatal,
  bindExpressMiddleware,
  bindFunction,
  getTraceId,
  enableDebug,
  disableDebug,
  getRequestId,
};
