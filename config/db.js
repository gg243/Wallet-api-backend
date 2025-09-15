import dotenv from "dotenv";
dotenv.config();

export const sql = process.env.DATABASE_URL;
