"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require('tracer').colorConsole({
    format: [
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
        {
            error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}'
        }
    ],
    dateformat: "isoDateTime",
    preprocess: function (data) {
        data.title = data.title.toUpperCase();
    }
});
const logger = {
    error: (o) => log.log({ level: "error", message: prepareForLogging(o) }),
    warn: (o) => log.warn(prepareForLogging(o)),
    info: (o) => log.info(prepareForLogging(o)),
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
    return message;
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