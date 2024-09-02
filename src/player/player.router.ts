import express from 'express';
import { PlayerController } from './player.controller';
import expressAsyncHandler from 'express-async-handler';
import { PlayerValidator } from './player.middleware';

export const playerRouter = express.Router()

playerRouter.get('/', expressAsyncHandler(PlayerController.getAll))

playerRouter.get('/:id', expressAsyncHandler(PlayerController.getById))

playerRouter.post('/', express.json(), PlayerValidator, expressAsyncHandler(PlayerController.create))

playerRouter.delete('/:id', expressAsyncHandler(PlayerController.deleteById))
