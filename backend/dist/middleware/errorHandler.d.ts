import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const errorHandler: (err: any, req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map