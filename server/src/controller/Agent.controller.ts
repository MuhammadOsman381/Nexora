import { Request, Response } from 'express';
import { trainModel, askQuestion } from '../services/Model.service';

export const handleTrain = async (req: Request, res: Response) => {
    const { url } = req.body;
    try {
        await trainModel(url);
        res.json({ message: "Training completed successfully." });
    } catch (error) {
        console.error('Training Error:', error);
        res.status(500).json({ error: 'Training failed.' });
    }
};

export const handleAsk = async (req: Request, res: Response) => {
    const { question } = req.body;
    try {
        const answer = await askQuestion(question);
        res.json({ answer });
    } catch (error) {
        console.error('QA Error:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Failed to answer question.';
        res.status(500).json({ error: errorMessage });
    }
};
