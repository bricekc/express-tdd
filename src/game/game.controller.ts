import { Request, Response } from "express";
import { gameRepository } from "./game.repository";
import { playerRepository } from "../player/player.repository";
import { ObjectId } from "mongodb";
import { Player } from "../player/player";
import { Game, Score } from "./game";
import { validationResult } from "express-validator";

export class GameController {
    static async get(req: Request, res: Response): Promise<void>
    {
        let filters = {}

        if (req.query?.match === 'finished') {
            filters = { ...filters, $or: [{"state.winner": 0}, {"state.winner": 1}] };
        } else if (req.query?.match === 'inProgress') {
            filters = {...filters, "state.winner": undefined}
        }

        if (req.query?.circuit) {
            filters = {...filters, "config.tour": req.query.circuit}
        }

        if (req.query.player) {
            filters = {
                ...filters,
                $or: [{"players.player1.lastName": req.query.player}, {"players.player2.lastName": req.query.player}]
            }
        }

        const games = await gameRepository.findAll(filters);
        res.send(games)
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
        const player1 = await playerRepository.findOneById(new ObjectId(String(req.body.players.id1)))
        const player2 = await playerRepository.findOneById(new ObjectId(String(req.body.players.id2)))
        const config = req.body.config
        const game = {
            players: {
                player1: player1 as Player,
                player2: player2 as Player
            }, config: {
                config
            }, state: {
                currentSet: 0,
                tieBreak: false,
                scores: []
            }
        } as unknown as Game

        await gameRepository.insert(game)
        res.status(201).send(game)
    }
}