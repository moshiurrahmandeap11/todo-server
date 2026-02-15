import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();

const {Pool} = pkg;


const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
})


// create connectDB for better use
export const connectDB = async() => {
    try {
        const client = await pool.connect();
        console.log("Postgres connected Successfully");
        client.release();

    } catch (e) {
        console.error("Postgres connection failed", e);
        process.exit(1);
    }
}

export default pool