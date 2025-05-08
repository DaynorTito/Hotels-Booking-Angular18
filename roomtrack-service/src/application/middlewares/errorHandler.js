export const errorHandler = (err, req, res, next) => {
  const response = {
    error: {
      status: err.statusCode || 500,
      type: err.errorType || "UNKNOWN_ERROR",
      message: err.message || "Internal Server Error",
      path: req.originalUrl,
      method: req.method,
      timestamp: err.timestamp || new Date().toISOString()
    }
  };

  if (err.validationErrors) {
    response.error.details = err.validationErrors;
  }

  if (err.details) {
    response.error.details = err.details;
  }

  res.status(response.error.status).json(response);
};

export default errorHandler;
