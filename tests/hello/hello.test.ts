import supertest from 'supertest';
import { app } from '../../src/app';
import {mongoClient} from '../../src/services/mongodb';
import {helloRepository} from '../../src/hello/hello.repository'
        
describe('Test /api/hello', () => {
    test('GET /api/hello/world', async () => {
        const response = await supertest(app).get('/api/hello/world');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({message: "hello"});
    });

    test.each([
        {a: 1, expected: 1},
        {a: 4, expected: 16},
        {a: 5, expected: 25},
        {a: 10, expected: 100},
        {a: 12, expected: 144}
    ])('GET /api/hello/square/{number}', async ({a, expected}) => {
        const response = await supertest(app).get(`/api/hello/square/${a}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({result: expected});
    });

    test('GET /api/hello/square/XYZ', async () => {
        const response = await supertest(app).get('/api/hello/square/XYZ');
        expect(response.statusCode).toBe(404);
    });

    test("GET /api/hello", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
            { message: "world" },
        ); 
        
        const response = await supertest(app).get("/api/hello");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toEqual(2);
        expect(response.body[0].message).toEqual("hello");
        expect(response.body[1].message).toEqual("world"); 
    });

    test("POST 201 /api/hello", async () => {
        const response = await supertest(app).post("/api/hello").send({message: "hello"})
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({message: "hello"});
    })

    test("POST 400 /api/hello", async () => {
        const response1 = await supertest(app).post("/api/hello").send({message: 36})
        expect(response1.statusCode).toBe(400);
        const response2 = await supertest(app).post("/api/hello").send({message: ""})
        expect(response2.statusCode).toBe(400);
    })

    test("GET 200 /api/hello/{id}", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
        ); 

        const hello = await helloRepository.findAll()
        
        const response = await supertest(app).get(`/api/hello/${hello[0]._id}`);
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.message).toEqual("hello");
    });

    test("GET 404 /api/hello/{id}", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
        ); 
        const response = await supertest(app).get(`/api/hello/6643606721a002f27b41fc54`);
        expect(response.statusCode).toBe(404);
    });

    test("DELETE 204 /api/hello/{id}", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
        );
        const hello = await helloRepository.findAll();
        const response = await supertest(app).delete(`/api/hello/${hello[0]._id}`);
        expect(response.statusCode).toBe(204);
    });

    test("DELETE 404 /api/hello/{id}", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
        ); 
        const response = await supertest(app).delete(`/api/hello/6643606721a002f27b41fc54`);
        expect(response.statusCode).toBe(404);
    });

    afterAll(async () => {
        await mongoClient.close();
    })
});
