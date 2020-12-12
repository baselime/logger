"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableDebug = exports.enableDebug = exports.getCorrelationId = exports.bindFunction = exports.bindExpressMiddleware = exports.fatal = exports.error = exports.warn = exports.info = exports.debug = void 0;
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const uuid_1 = require("uuid");
const logLevels = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
};
let logLevel = logLevels[process.env.LOG_LEVEL || ""] || logLevels.info;
const namespace = 'lesley';
const ns = cls_hooked_1.default.createNamespace(namespace);
function buildMessage(level, message, extra) {
    let log = {
        message,
        extra: prepareForLogging(extra),
        time: (new Date).toISOString(),
        correlationId: cls_hooked_1.default.getNamespace(namespace).get('correlationId'),
        level,
    };
    if (extra === null || extra === void 0 ? void 0 : extra.correlationId) {
        log.correlationId = extra.correlationId;
        extra.correlationId = undefined;
    }
    if (extra === null || extra === void 0 ? void 0 : extra.error) {
        Object.assign(log, { error: enumerateError(extra.error) });
        extra.error = "";
        delete extra.error;
    }
    return log;
}
function enumerateError(error) {
    return Object.assign({
        message: error.message,
        stack: error.stack
    }, error);
}
function prepareForLogging(extra) {
    const ommitedInLogs = [
        "forename",
        "surname",
        "email",
        "password",
    ];
    if (typeof extra.body === "object" && extra.body !== null) {
        try {
            extra.body = JSON.stringify(extra.body);
        }
        catch (error) {
            extra.body = "There was an error parsing this in the logger";
        }
    }
    return omit(extra, ommitedInLogs);
}
function omit(data, toOmit) {
    if (!data)
        return data;
    let result = Object.assign({}, data);
    Object.keys(data).forEach((key) => {
        if (toOmit.includes(key)) {
            delete result[key];
            return;
        }
    });
    return result;
}
function log(level, message, extra) {
    if (logLevel <= logLevels[level]) {
        const m = JSON.stringify(buildMessage(level, message, extra));
        process.stdout.write(`${m}\n`);
    }
}
function debug(message, extra) { log("debug", message, extra); }
exports.debug = debug;
function info(message, extra) { log("info", message, extra); }
exports.info = info;
function warn(message, extra) { log("warn", message, extra); }
exports.warn = warn;
function error(message, extra) { log("error", message, extra); }
exports.error = error;
function fatal(message, extra) { log("fatal", message, extra); }
exports.fatal = fatal;
function bindExpressMiddleware(req, res, next) {
    ns.bindEmitter(req);
    ns.bindEmitter(res);
    ns.run(() => {
        const correlationId = req.header("x-correlation-id") || uuid_1.v4();
        cls_hooked_1.default.getNamespace(namespace).set("correlationId", correlationId);
        next();
    });
}
exports.bindExpressMiddleware = bindExpressMiddleware;
function bindFunction(func, correlationId = "") {
    return ns.bind(function () {
        cls_hooked_1.default.getNamespace(namespace).set("correlationId", correlationId || uuid_1.v4());
        return func.apply(null, arguments);
    });
}
exports.bindFunction = bindFunction;
function getCorrelationId() {
    return cls_hooked_1.default.getNamespace(namespace).get('correlationId');
}
exports.getCorrelationId = getCorrelationId;
function enableDebug() {
    logLevel = logLevels.debug;
}
exports.enableDebug = enableDebug;
function disableDebug() {
    logLevel = logLevels.info;
}
exports.disableDebug = disableDebug;
exports.default = {
    debug,
    info,
    warn,
    error,
    fatal,
    bindExpressMiddleware,
    bindFunction,
    getCorrelationId,
    enableDebug,
    disableDebug,
};
//# sourceMappingURL=index.js.map