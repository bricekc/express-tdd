import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { GameController } from './game.controller';
import { GameValidator } from './game.middleware';

export const gameRouter = express.Router()

gameRouter.get('/', expressAsyncHandler(GameController.get))

gameRouter.post('/new', express.json(), GameValidator, expressAsyncHandler(GameController.create))