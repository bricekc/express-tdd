import express from 'express';
import { HelloController } from './hello.controller';
import expressAsyncHandler from 'express-async-handler';
import { HelloValidator } from './hello.middleware';


export const helloRouter = express.Router()

helloRouter.get('/world', HelloController.sayHello)

helloRouter.get('/square/:number', HelloController.square)

helloRouter.get('/', expressAsyncHandler(HelloController.get))

helloRouter.post('/', express.json(), HelloValidator, expressAsyncHandler(HelloController.create))

helloRouter.get('/:id', expressAsyncHandler(HelloController.getById))

helloRouter.delete('/:id', expressAsyncHandler(HelloController.delete))