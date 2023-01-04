export declare function debug(message: Capitalize<string>, extra?: Record<string, any>): void;
export declare function info(message: Capitalize<string>, extra?: Record<string, any>): void;
export declare function warn(message: Capitalize<string>, extra?: Record<string, any>): void;
export declare function error(message: Capitalize<string>, extra?: {
    error: any;
    [key: string]: any;
}): void;
export declare function fatal(message: Capitalize<string>, extra?: Record<string, any>): void;
export declare function bindExpressMiddleware(req: any, res: any, next: any): void;
export declare function bindFunction(func: Function, requestId?: string, traceId?: string): any;
export declare function getTraceId(): string;
export declare function getRequestId(): string;
export declare function enableDebug(): void;
export declare function disableDebug(): void;
declare const _default: {
    debug: typeof debug;
    info: typeof info;
    warn: typeof warn;
    error: typeof error;
    fatal: typeof fatal;
    bindExpressMiddleware: typeof bindExpressMiddleware;
    bindFunction: typeof bindFunction;
    getTraceId: typeof getTraceId;
    enableDebug: typeof enableDebug;
    disableDebug: typeof disableDebug;
    getRequestId: typeof getRequestId;
};
export default _default;
