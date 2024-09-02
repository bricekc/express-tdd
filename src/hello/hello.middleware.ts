import { body } from "express-validator";

export const HelloValidator = [
    body('message', 'Invalid type').isString(),
    body('message', 'message does not empty').not().isEmpty()
];