"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const enumerateError = (error) => {
    return Object.assign({
        message: error.message,
        stack: error.stack
    }, error);
};
const log = winston_1.default.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 4,
    },
    level: process.env.LOG_LEVEL || "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(info => {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console()
    ]
});
const logger = {
    error: (o) => log.log({ level: "error", message: prepareForLogging(o) }),
    warn: (o) => log.warn(prepareForLogging(o)),
    info: (o) => log.info(prepareForLogging(o)),
    verbose: (o) => log.verbose(prepareForLogging(o)),
    debug: (o) => log.debug(prepareForLogging(o)),
};
function prepareForLogging(message) {
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
function omit(data, toOmit) {
    if (!data)
        return data;
    let result = Object.assign({}, data);
    Object.keys(data).forEach((key) => {
        if (toOmit.includes(key)) {
            delete result[key];
            return;
        }
        if (typeof result[key] === "object") {
            result[key] = omit(result[key], toOmit);
        }
    });
    return result;
}
exports.default = logger;
//# sourceMappingURL=index.js.map