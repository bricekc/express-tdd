import { body } from "express-validator";

export const GameValidator = [
    body('players.id1', "Invalid Types").isString(),
    body('players.id2', "Invalid Types").isString(),
    body('config.tour', "Invalid types").isString(),
    body('config.sets', 'Invalid types').isNumeric(),
]