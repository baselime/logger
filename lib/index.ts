const log = require('tracer').colorConsole({
  format: [
    '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
    {
      error:
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}'
    }
  ],
  dateformat: "isoDateTime",
  preprocess: function(data) {
    data.title = data.title.toUpperCase()
  }
})

interface ILogMessage {
  message: string,
  data: Object,
  correlationId: string,
  error?: any,
}

const logger = {
  error: (o: ILogMessage) => log.error(prepareForLogging(o)),
  warn: (o: ILogMessage) => log.warn(prepareForLogging(o)),
  info: (o: ILogMessage) => log.info(prepareForLogging(o)),
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
  return message;
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
