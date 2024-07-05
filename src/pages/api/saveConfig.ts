import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { newConfig } = req.body;

        if (!newConfig) {
            return res.status(400).json({ error: 'No config data provided' });
        }

        try {
            const filePath = path.join(process.cwd(), 'public', 'current_layout.json');
           // to update the typical supermarket json, use the filePath below
           // const filePath = path.join(process.cwd(), 'public', 'typical_supermarket.json');
            fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2));
            return res.status(200).json({ message: 'Config saved successfully' });
        } catch (error) {
            console.error('Error saving config:', error);
            return res.status(500).json({ error: 'Failed to save config' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
