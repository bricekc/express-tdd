import { mongodb } from "../services/mongodb";
import { Game } from "./game";

class GameRepository {
    private gameCollection = mongodb.collection<Game>('game');

    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<Game>) => Game) : Promise<void> {
        await this.clear();
        for (let i = 0; i<count; i++) {
            await this.insert(fixturesGenerator())
        }
    }

    async findAll(filters? : Object) : Promise<Game[]> {
        return await this.gameCollection.find(filters ?? {}).toArray();
    }

    async insert(...data : Game[]) : Promise<void> {
        await this.gameCollection.insertMany(data);
    }

    async clear(): Promise<void> {
        await this.gameCollection.deleteMany();
    }
}

export const gameRepository = new GameRepository();