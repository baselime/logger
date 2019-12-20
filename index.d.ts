declare namespace logger {
  function info(message: ILogMessage): void;
  function debug(message: ILogMessage): void;
  function warn(message: ILogMessage): void;
  function error(message: ILogMessage): void;
}

interface ILogMessage {
  data: Object,
  message: string,
  correlationId: string,
  error?: any,
}

export = logger;