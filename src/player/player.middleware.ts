import { body } from "express-validator";

export const PlayerValidator = [
    body('firstName', "Invalid type").isString(),
    body('firstName', 'firstName does not empty').not().isEmpty(),
    body('lastName', "Invalid type").isString(),
    body('lastName', 'lastName does not empty').not().isEmpty(),
    body('tour', "Invalid type").isString(),
    body('tour', "Invalid value").exists().custom((value) => {
        if (value !== "ATP" && value !== "WTA") {
            throw new Error("Invalid value")
        }
        return true
    }),
    body('tour', 'tour does not empty').not().isEmpty(),
    body('country', "Invalid type").isString(),
    body('country', 'country does not empty').not().isEmpty(),
]