export declare function debug(message: string, extra?: Record<string, any>): void;
export declare function info(message: string, extra?: Record<string, any>): void;
export declare function warn(message: string, extra?: Record<string, any>): void;
export declare function error(message: string, extra?: Record<string, any>): void;
export declare function fatal(message: string, extra?: Record<string, any>): void;
export declare function bindExpressMiddleware(req: any, res: any, next: any): void;
export declare function bindFunction(func: Function, correlationId?: string): any;
export declare function getCorrelationId(): string;
declare const _default: {
    debug: typeof debug;
    info: typeof info;
    warn: typeof warn;
    error: typeof error;
    fatal: typeof fatal;
    bindExpressMiddleware: typeof bindExpressMiddleware;
    bindFunction: typeof bindFunction;
    getCorrelationId: typeof getCorrelationId;
};
export default _default;
