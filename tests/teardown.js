import pool from "../src/config/db";

export default async () => {
    await pool.end();
}