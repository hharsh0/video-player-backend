import type { Request, Response } from "express";

export const getListing = (req: Request, res: Response) => {
    res.json({message: "this is listing api!"});
}