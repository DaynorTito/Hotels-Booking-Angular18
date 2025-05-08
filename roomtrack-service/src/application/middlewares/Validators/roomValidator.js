import { body } from "express-validator";

export const roomValidationCreateRules = [
  body("hotel")
    .notEmpty()
    .withMessage("The hotel ID is required.")
    .isMongoId()
    .withMessage("The hotel ID must be a valid ObjectId."),

  body("type")
    .notEmpty()
    .withMessage("The room type is required.")
    .isIn(["Single", "Double", "Triple", "Suite", "Suite with Extra Bed"])
    .withMessage(
      "The room type must be one of the following: Single, Double, Triple, Suite, Suite with Extra Bed."
    ),

  body("capacity")
    .notEmpty()
    .withMessage("The room capacity is required.")
    .not()
    .isString()
    .withMessage("Capacity must be a number.")
    .isInt({ min: 1 })
    .withMessage("Capacity must be an integer more than 1"),

  body("price")
    .notEmpty()
    .withMessage("The room price is required.")
    .not()
    .isString()
    .withMessage("Price must be a number.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0."),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array of strings.")
    .custom((value) => value.every((item) => typeof item === "string"))
    .withMessage("Each item in amenities must be a string.")
];

export const roomValidationUpdateRules = [
  body("hotel")
    .optional()
    .isMongoId()
    .withMessage("The hotel ID must be valid."),

  body("type")
    .optional()
    .isIn(["Single", "Double", "Triple", "Suite", "Suite with Extra Bed"])
    .withMessage(
      "The room type must be one of the following: Single, Double, Triple, Suite, Suite with Extra Bed."
    ),

  body("capacity")
    .optional()
    .not()
    .isString()
    .withMessage("Capacity must be a number.")
    .isInt({ min: 1 })
    .withMessage("Capacity must be an integer more than 1."),

  body("price")
    .optional()
    .not()
    .isString()
    .withMessage("Price must be a number.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0."),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array of strings.")
    .custom((value) => value.every((item) => typeof item === "string"))
    .withMessage("Each item in amenities must be a string.")
];
