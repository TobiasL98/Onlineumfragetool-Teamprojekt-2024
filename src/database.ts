import { Database } from 'drizzle-orm';
import { SQLiteDriver } from 'drizzle-orm-sqlite';

const driver = new SQLiteDriver('./database.sqlite');
const db = new Database(driver);

export default db;