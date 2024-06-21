import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { IeFlowFile } from 'interfaces/edit/IeFlowFile';

const getConfig = (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const filePath = path.join(process.cwd(), 'public', 'current_layout.json');
        const rawConfig = fs.readFileSync(filePath, 'utf-8');
        //console.log('rawConfig: ', rawConfig)
        const config = JSON.parse(rawConfig) as IeFlowFile; 
        //console.log('configname : ', config.name)
        res.status(200).json(config);
    } catch (error) {
        console.error('Error reading config file:', error);
        res.status(500).json({ error: 'Failed to read config file' });
    }
};

export default getConfig;
