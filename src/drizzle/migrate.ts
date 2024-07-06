import "dotenv/config"
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';


const migrationCLient = postgres(process.env.DATABASE_URL as string)

async function main() {
    await migrate(drizzle(migrationCLient), {
        migrationsFolder: "./src/drizzle/migrations",
    })
    await migrationCLient.end()
}

main()

