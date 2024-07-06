import { NextApiRequest, NextApiResponse } from 'next';
import "dotenv/config"
import { db } from 'drizzle/db';
import { UserTable } from 'drizzle/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      try {
        const { days, time, age, sex, diet, occupation, buyingFor, allergies, otherAllergies } = req.body;
  
        await db.insert(UserTable).values({
          days: JSON.stringify(days),
          time,
          age: age || null,
          sex: sex || null,
          diet: diet || null,
          occupation: occupation || null,
          buyingFor: JSON.stringify(buyingFor),
          allergies: JSON.stringify(allergies),
          otherAllergies: otherAllergies || null,
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