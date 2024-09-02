import 'dotenv/config';
import { createHelloData } from "./hello/hello.fixtures";
import { helloRepository } from "./hello/hello.repository";
import { playerRepository } from './player/player.repository';
import { createPlayerData } from './player/player.fixtures';
import { gameRepository } from './game/game.repository';
import { createGameData } from './game/game.fixtures';

helloRepository.populate(20, createHelloData).then(() => {
    process.exit()
})  
playerRepository.populate(20, createPlayerData).then(() => {
    process.exit()
})  

gameRepository.populate(20, createGameData).then(() => {
    process.exit()
})