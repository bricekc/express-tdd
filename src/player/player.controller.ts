import { Request, Response } from "express";
import { playerRepository } from "./player.repository";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";

export class PlayerController {
    static async getAll(req: Request, res: Response): Promise<void>
    {
        if (req.query.firstName) {
            delete req.query.firstName
        }
        const players = await playerRepository.findAll(req.query);
        res.send(players)
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
        await playerRepository.insert(req.body)
        res.status(201).send(req.body)
    }

    static async getById(req: Request, res: Response): Promise<void>
    {
        const player = await playerRepository.findOneById(new ObjectId(req.params.id))
        player === null ? res.status(404).json({
            "status": "error",
            "message": "Player non trouvé.",
        }) : res.send(player)
    }


    static async deleteById(req: Request, res: Response): Promise<void>
    {
        const result = await playerRepository.delete(new ObjectId(req.params.id))
        result.deletedCount === 0
            ? res.status(404).json({
                "status": "error",
                "message": "Player non trouvé.",
            })
            : res.status(204).send("Deleted successfully")
    }
}
