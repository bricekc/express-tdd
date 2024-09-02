import supertest from "supertest";
import { mongoClient } from "../../src/services/mongodb";
import { app } from "../../src/app";
import { playerRepository } from "../../src/player/player.repository";
import { ObjectId } from "mongodb";

describe('Test /api/player', () => {
    test('GET /api/player', async () => {
        await playerRepository.clear();
        await playerRepository.insert({
            _id: new ObjectId("66470c425b4b5c31335285da"),
            firstName: "john",
            lastName: "doe",
            tour: "ATP",
            country: "English"
        })
        const response = await supertest(app).get('/api/player');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject([{
            _id: "66470c425b4b5c31335285da",
            firstName: "john",
            lastName: "doe",
            tour: "ATP",
            country: "English"
        }]);
    });

    test.each([
        {a : "tour=ATP", expected: [{
            _id: "66470c425b4b5c31335285da",
            firstName: "john",
            lastName: "doe",
            tour: "ATP",
            country: "English"
        }]},
        {a: "lastName=azerty", expected: [{
                _id: "66470c425b4b5c31335285db",
                firstName: "jahn",
                lastName: "azerty",
                tour: "WTA",
                country: "French"
        }]},
        {a : "country=English", expected: [{
            _id: "66470c425b4b5c31335285da",
            firstName: "john",
            lastName: "doe",
            tour: "ATP",
            country: "English"
        }]},
        {a: "firstName=fgjggfgju", expected: [{
                _id: "66470c425b4b5c31335285da",
                firstName: "john",
                lastName: "doe",
                tour: "ATP",
                country: "English"
        },
        {
            _id: "66470c425b4b5c31335285db",
            firstName: "jahn",
            lastName: "azerty",
            tour: "WTA",
            country: "French"
        }]},
        {a: "lastName=azerty&tour=WTA", expected: [{
            _id: "66470c425b4b5c31335285db",
            firstName: "jahn",
            lastName: "azerty",
            tour: "WTA",
            country: "French"
    }]},
    ])('GET with Params /api/player', async ({a,expected}) => {
        await playerRepository.clear()
        await playerRepository.insert({
            _id: new ObjectId("66470c425b4b5c31335285da"),
            firstName: "john",
            lastName: "doe",
            tour: "ATP",
            country: "English"
        },
        {
            _id: new ObjectId("66470c425b4b5c31335285db"),
            firstName: "jahn",
            lastName: "azerty",
            tour: "WTA",
            country: "French"
        })
        const response = await supertest(app).get(`/api/player?${a}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expected);
    })

    test("POST 201 /api/player", async () => {
        await playerRepository.clear()
        const response = await supertest(app).post("/api/player").send({firstName: "john", lastName: "doe", country: "England", tour: 'WTA'})
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({firstName: "john", lastName: "doe", country: "England", tour: 'WTA'});
    })

    test("POST 400 /api/player", async () => {
        await playerRepository.clear()
        const response1 = await supertest(app).post("/api/player").send({firstName: 1, lastName: 2, country: 3, tour: "AzTP"})
        expect(response1.statusCode).toBe(400);
    })

    test("GET 200 /api/player/{id}", async () => {
        await playerRepository.clear();
        await playerRepository.insert(
            {firstName: "john", lastName: "doe", country: "England", tour: 'WTA'}
        ); 
        const player = await playerRepository.findAll()
        const response = await supertest(app).get(`/api/player/${player[0]._id}`);
        
        expect(response.statusCode).toBe(200); 
    });

    test("GET 404 /api/player/{id}", async () => {
        await playerRepository.clear();
        await playerRepository.insert(
            {firstName: "john", lastName: "doe", country: "England", tour: 'WTA'}
        ); 
        const response = await supertest(app).get(`/api/player/6643606721a002f27b41fc54`);
        expect(response.statusCode).toBe(404);
    });

    test("DELETE 204 /api/player/{id}", async () => {
        await playerRepository.clear();
        await playerRepository.insert(
            {firstName: "john", lastName: "doe", country: "England", tour: 'WTA'}
        );
        const player = await playerRepository.findAll();
        const response = await supertest(app).delete(`/api/player/${player[0]._id}`);
        expect(response.statusCode).toBe(204);
    });

    test("DELETE 404 /api/hello/{id}", async () => {
        await playerRepository.clear();
        await playerRepository.insert(
            {firstName: "john", lastName: "doe", country: "England", tour: 'WTA'}
        ); 
        const response = await supertest(app).delete(`/api/player/6643606721a002f27b41fc54`);
        expect(response.statusCode).toBe(404);
    });

    afterAll(async () => {
        await mongoClient.close();
    })
});