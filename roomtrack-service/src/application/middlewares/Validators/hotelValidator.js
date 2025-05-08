import { body } from "express-validator";

export const hotelValidationCreateRules = [
  body("name")
    .notEmpty()
    .withMessage("The hotel name is required.")
    .isString()
    .withMessage("The hotel name must be a string.")
    .trim(),

  body("location.address")
    .notEmpty()
    .withMessage("The address is required.")
    .isString()
    .withMessage("The address must be a string."),

  body("location.city")
    .notEmpty()
    .withMessage("The city is required.")
    .isString()
    .withMessage("The city must be a string."),

  body("location.coordinates.latitude")
    .optional()
    .not()
    .isString()
    .withMessage("Latitude must not be a string."),

  body("location.coordinates.longitude")
    .optional()
    .not()
    .isString()
    .withMessage("Longitude must not be a string."),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5.")
    .not()
    .isString()
    .withMessage("Rating must not be a string."),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array of strings.")
    .custom((value) => value.every((item) => typeof item === "string"))
    .withMessage("Each item in amenities must be a string."),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings.")
];

export const hotelValidationUpdateRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("The hotel name must be a string.")
    .trim(),

  body("location.address")
    .optional()
    .isString()
    .withMessage("The address must be a string.")
    .notEmpty()
    .withMessage("The address cannot be empty."),

  body("location.city")
    .optional()
    .isString()
    .withMessage("The city must be a string.")
    .notEmpty()
    .withMessage("The city cannot be empty."),

  body("location.coordinates.latitude")
    .optional()
    .not()
    .isString()
    .withMessage("Latitude must not be a string."),

  body("location.coordinates.longitude")
    .optional()
    .not()
    .isString()
    .withMessage("Longitude must not be a string."),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5.")
    .not()
    .isString()
    .withMessage("Rating must not be a string."),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array of strings.")
    .custom((value) => value.every((item) => typeof item === "string"))
    .withMessage("Each item in amenities must be a string."),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings.")
];
