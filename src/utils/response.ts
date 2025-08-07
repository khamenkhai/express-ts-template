import { Response } from 'express';

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T | null;
}

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): void {
  const response: ApiResponse<T> = {
    status: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };

  res.status(statusCode).json(response);
}
