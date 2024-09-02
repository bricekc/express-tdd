import { DeleteResult, ObjectId } from "mongodb";
import { mongodb } from "../services/mongodb";
import { HelloData } from "./hello";
        

class HelloRepository {
    private helloCollection = mongodb.collection<HelloData>('hello');
    
    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<HelloData>) => HelloData) : Promise<void> {
        await this.clear();
        for (let i = 0; i<count; i++) {
            await this.insert(fixturesGenerator())
        }
    }

    async findAll() : Promise<HelloData[]> {
        return await this.helloCollection.find({}).toArray();
    }

    async findOneById(id: ObjectId): Promise<HelloData | null> {
        return await this.helloCollection.findOne({_id : id});
    }

    async insert(...data : HelloData[]) : Promise<void> {
        await this.helloCollection.insertMany(data);
    }

    async clear(): Promise<void> {
        await this.helloCollection.deleteMany();
    }

    async delete(id: ObjectId): Promise<DeleteResult> {
        return await this.helloCollection.deleteOne({_id: id});
    }
}

export const helloRepository = new HelloRepository();