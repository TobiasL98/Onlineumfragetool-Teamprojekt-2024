import { NextApiRequest, NextApiResponse } from 'next';
import "dotenv/config"
import { db } from 'drizzle/db';
import { SupermarketTable } from 'drizzle/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { layout } = req.body;

            await db.insert(SupermarketTable).values({
                layout: layout
            });

            res.status(200).json({ message: 'Data saved successfully' });
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({ error: 'Failed to save data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}