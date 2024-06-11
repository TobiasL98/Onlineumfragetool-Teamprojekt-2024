import { Database, SQLiteDriver } from 'drizzle-orm';

const driver = new SQLiteDriver('./database.sqlite');
const db = new Database(driver);

export default db;