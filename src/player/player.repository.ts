import { DeleteResult, ObjectId } from "mongodb";
import { mongodb } from "../services/mongodb";
import { Player } from "./player";

class PlayerRepository {
    private playerCollection = mongodb.collection<Player>('player');

    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<Player>) => Player) : Promise<void> {
        await this.clear();
        for (let i = 0; i<count; i++) {
            await this.insert(fixturesGenerator())
        }
    }

    async findAll(filters? : Object) : Promise<Player[]> {
        return await this.playerCollection.find(filters ?? {}).toArray();
    }

    async findOneById(id: ObjectId): Promise<Player| null> {
        return await this.playerCollection.findOne({_id: id})
    }

    async insert(...data : Player[]) : Promise<void> {
        await this.playerCollection.insertMany(data);
    }

    async clear(): Promise<void> {
        await this.playerCollection.deleteMany();
    }

    async delete(id: ObjectId): Promise<DeleteResult> {
        return await this.playerCollection.deleteOne({_id: id});
    }
}

export const playerRepository = new PlayerRepository();