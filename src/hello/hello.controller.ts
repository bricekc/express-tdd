import { Request, Response } from "express";
import { helloRepository } from "./hello.repository";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";

export class HelloController {
    static sayHello(req: Request, res: Response): void {
        res.send({message: "hello"})
    }

    static square(req: Request, res: Response): void {
        const number = Number(req.params.number)
        
        isNaN(number) === true
            ? res.status(404).send("Invalid number")
            : res.send({result: number*number})
    }

    static async get(req: Request, res: Response): Promise<void>
    {
        const hellos = await helloRepository.findAll();
        res.send(hellos)
    }

    static async getById(req: Request, res: Response): Promise<void>
    {
        const hello = await helloRepository.findOneById(new ObjectId(req.params.id))
        hello === null ? res.status(404).json({
            "status": "error",
            "message": "Message non trouvé.",
        }) : res.send(hello)
    }

    static async create(req: Request, res: Response): Promise<void>
    {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                "status": "error",
                "message": "Données invalides.",
            })
        }
        await helloRepository.insert(req.body)
        res.status(201).send(req.body)
    }

    static async delete(req: Request, res: Response): Promise<void>
    {
        const result = await helloRepository.delete(new ObjectId(req.params.id))
        result.deletedCount === 0
            ? res.status(404).json({
                "status": "error",
                "message": "Message non trouvé.",
            })
            : res.status(204).send("Deleted successfully")
    }
}