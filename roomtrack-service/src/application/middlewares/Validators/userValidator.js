import { body } from "express-validator";

export const registerValidationRules = [
  body("email")
    .isEmail()
    .withMessage("A valid email address is required.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),

  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters.")
    .trim()
];

export const loginValidationRules = [
  body("email")
    .isEmail()
    .withMessage("A valid email address is required.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required.")
];
