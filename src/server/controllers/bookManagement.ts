import { Request, Response } from "express";

export const addBook = async (req: Request, res: Response) => {
    try {
        const { title, author, publishedDate } = req.body;
        // TODO: Implement book addition logic
        res.status(201).json({ message: 'Book added successfully', title, author, publishedDate });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error });
    }
};