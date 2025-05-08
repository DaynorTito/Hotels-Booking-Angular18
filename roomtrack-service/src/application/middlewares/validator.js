import { validationResult } from "express-validator";
import { INVALID_INPUT } from "../utils/errors.js";

export const validateBodyRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }));

      const error = INVALID_INPUT("Validation failed");
      error.validationErrors = formattedErrors;
      return next(error);
    }

    next();
  };
};
