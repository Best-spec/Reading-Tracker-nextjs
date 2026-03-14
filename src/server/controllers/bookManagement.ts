import { Request, response } from "express";

export const addBook = async (req: Request, res: Response) => {
    try {
        const { title, author, publishedDate } = req.body;