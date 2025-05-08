export class AppError extends Error {
  constructor(statusCode, message, errorType = "APP_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

export const RESOURCE_NOT_FOUND = (resource = "Resource") => {
  return new AppError(404, `${resource} not found`, "NOT_FOUND");
};

export const UNAUTHENTICATED = (message = "Authentication required") => {
  return new AppError(401, message, "UNAUTHENTICATED");
};

export const UNAUTHORIZED = () => {
  return new AppError(
    403,
    "You are not authorized to perform this action",
    "UNAUTHORIZED"
  );
};

export const INVALID_INPUT = (message = "Invalid input data") => {
  return new AppError(400, message, "INVALID_INPUT");
};

export const ALREADY_EXISTS = (resource = "Resource") => {
  return new AppError(409, `${resource} already exists`, "CONFLICT");
};

export const INTERNAL_SERVER_ERROR = (details = null) => {
  return new AppError(500, "Internal server error", "INTERNAL_ERROR", details);
};

export const DATABASE_ERROR = (details = null) => {
  return new AppError(
    503,
    "Database operation failed",
    "DATABASE_ERROR",
    details
  );
};
