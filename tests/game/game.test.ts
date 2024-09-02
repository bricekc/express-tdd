import supertest from "supertest";
import { app } from '../../src/app';
import {mongoClient} from '../../src/services/mongodb';
import { gameRepository } from "../../src/game/game.repository";
import { createGameData } from '../../src/game/game.fixtures';
import { Game } from "../../src/game/game";
import { playerRepository } from "../../src/player/player.repository";
import { ObjectId } from "mongodb";
import { cp } from "fs";

describe('Test /api/game', () => {
    test("GET /api/game", async () => {
        await gameRepository.clear();
        await gameRepository.insert({
            players: {
                player1: {
                    firstName: "john",
                    lastName: "doe",
                    country: "England",
                    tour: 'WTA'
                },
                player2: {
                    firstName: "jahn",
                    lastName: "doe",
                    country: "French",
                    tour: 'WTA'
                },
            },
            config: {
                tour: "WTA",
                sets: 2
            },
            state: {
                currentSet: 1,
                tieBreak: false,
                scores: [{ sets: 1, games: 2, points: 30}, { sets: 1, games: 1, points: 15}],
                winner: 0
            }
        }); 
        
        const response = await supertest(app).get("/api/game");
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toEqual(1);
    });

    const gameCircuit = createGameData({config: {tour: "ATP"}, state: {winner: 3}, players: {player1: {lastName: 'ahah'}}} as Partial<Game>)
    const gameMatch = createGameData({config: {tour: "WTA"}, state: {winner: 1}, players: {player1: {lastName: 'truc'}}} as Partial<Game>)
    const gamePlayer = createGameData({config: {tour: "WTA"}, state: {winner: 3}, players: {player1: {lastName: 'doe'}}} as Partial<Game>)
    test.each([
        {a: "match=finished"},
        {a : "circuit=ATP"},
        {a : "player=doe"},
    ])('GET with Params /api/game', async ({a}) => {
        await gameRepository.clear()
        await gameRepository.insert(gameCircuit, gameMatch, gamePlayer)
        const response = await supertest(app).get(`/api/game?${a}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(1);
    })

    test("POST 201 /api/game/new", async () => {
        await gameRepository.clear()
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
            tour: "ATP",
            country: "French"
        })
        const response = await supertest(app).post("/api/game/new").send({
            players: {
                id1: "66470c425b4b5c31335285da",
                id2: "66470c425b4b5c31335285db",
            },
            config: {
                tour: "ATP",
                sets: 3
            }
        })
        expect(response.statusCode).toBe(201);
        const game = await supertest(app).get("/api/game");
        expect(response.body).toMatchObject(game.body[0]);
    })


    test("POST 400 api/game/new", async () => {
        await gameRepository.clear()
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
            tour: "ATP",
            country: "French"
        })
        const response = await supertest(app).post("/api/game/new").send({
            players: {
                id1: "66470c425b4b5c31335285da",
                id2: "66470c425b4b5c31335285db",
            },
            config: {
                tour: 1,
                sets: "l"
            }
        })
    })

    afterAll(async () => {
        await mongoClient.close();
    })


});