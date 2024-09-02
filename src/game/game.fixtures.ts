import { faker } from "@faker-js/faker";
import { createPlayerData } from "../player/player.fixtures";
import { Game, Score } from "./game";
import { Tour } from "../player/player";

function createScoreData(): Score {
    return {
        sets: faker.number.int({min: 0, max: 3}),
        games: [],
        points: faker.number.int({min: 0, max: 4})
    } as Score
}
export function createGameData(partialData?: Partial<Game>): Game
{
    return {
        players: {
            player1: partialData?.players?.player1 ?? createPlayerData(),
            player2: partialData?.players?.player2 ?? createPlayerData(),
        },
        config: {
            tour: (partialData?.config?.tour.includes('ATP') || partialData?.config?.tour.includes('WTA'))? partialData?.config.tour : faker.helpers.arrayElement<Tour>(["ATP", "WTA"]) ,
            sets: partialData?.config?.sets ?? 5,
        },
        state: {
            currentSet: partialData?.state?.currentSet ?? faker.number.int({ min: 0, max: 5}),
            tieBreak: partialData?.state?.tieBreak ?? faker.datatype.boolean(),
            scores: partialData?.state?.scores ?? [createScoreData(), createScoreData()],
            winner: partialData?.state?.winner ?? faker.number.int({ min: 0, max: 1})
        }
    } as Game
}