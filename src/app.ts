import express, { Request, Response, NextFunction } from 'express';
import { helloRouter } from './hello/hello.router';
import { playerRouter } from './player/player.router';
import { gameRouter } from './game/game.router';
        
export const app = express();

app.use('/api/hello', helloRouter)
app.use('/api/player', playerRouter)
app.use('/api/game', gameRouter)
