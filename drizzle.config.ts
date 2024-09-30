import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/db/schema.ts',
    out: './src/lib/db/drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DATABASE_HOST as string,
        user: process.env.DATABASE_USER as string,
        password: process.env.DATABASE_PASSWORD as string,
        database: process.env.DATABASE_NAME as string,
        port: process.env.DATABASE_PORT as unknown as number,
    }
});