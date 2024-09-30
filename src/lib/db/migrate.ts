import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from "postgres";
import dotenv from 'dotenv';
import { db } from './index';

dotenv.config();
const client = postgres(process.env.DATABASE_URL as string, { max: 1 });
await migrate(db, { migrationsFolder: 'src/lib/db/drizzle' });

client.end();

