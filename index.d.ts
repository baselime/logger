export function debug(message: string, extra?: Record<string, any>): void;
export function info(message: string, extra?: Record<string, any>): void;
export function warn(message: string, extra?: Record<string, any>): void;
export function error(message: string, extra?: Record<string, any>): void;
export function fatal(message: string, extra?: Record<string, any>): void;
export function bindExpressMiddleware(req: any, res: any, next: any): void;
export function bindFunction(func: Function, correlationId?: string): any;
export function getCorrelationId(): string;