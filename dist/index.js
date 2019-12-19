"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const log = winston_1.default.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5
    },
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(info => {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({
            filename: './logs/combined.log',
            level: 'info'
        }),
        new winston_1.default.transports.File({
            filename: './logs/errors.log',
            level: 'error'
        }),
        new winston_1.default.transports.Console()
    ]
});
const logger = {
    error: (o) => log.error({ message: JSON.stringify(o) }),
    warn: (o) => log.warn({ message: JSON.stringify(o) }),
    info: (o) => log.info({ message: JSON.stringify(o) }),
    verbose: (o) => log.verbose({ message: JSON.stringify(o) }),
    debug: (o) => log.debug({ message: JSON.stringify(o) }),
    silly: (o) => log.silly({ message: JSON.stringify(o) }),
};
exports.default = logger;
//# sourceMappingURL=index.js.map