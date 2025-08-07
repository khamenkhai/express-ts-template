import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): any => {
  // log messages
  // Prepare a message for the log
  let logMessage = `
[${req.method}] ${req.originalUrl}
Message: ${err.message}
`;

  if (err instanceof ZodError) {
    const details = err.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("\n");
    logMessage += `Validation Errors:\n${details}`;
  }

  if (err.stack) {
    logMessage += `\nStack Trace:\n${err.stack}`;
  }

  // 📝 Log to file using Winston
  logger.error(logMessage);

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors,
    });
  }

  // Handle other errors (e.g., AppError)
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    status: false,
    statusCode: status,
    message: message,
  });
};
