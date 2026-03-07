const { Pool } = require("pg");
const conf = require("../set");

const pool = new Pool({
    connectionString: conf.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function createTables() {
    const client = await pool.connect();
    try {
        // Create users_rank table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users_rank (
                jid TEXT PRIMARY KEY,
                rank INTEGER DEFAULT 0,
                exp INTEGER DEFAULT 0,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Table 'users_rank' created successfully");
        
        // Create other tables if needed
        await client.query(`
            CREATE TABLE IF NOT EXISTS antilien (
                jid TEXT PRIMARY KEY,
                etat TEXT DEFAULT 'non',
                action TEXT DEFAULT 'delete'
            );
        `);
        console.log("✅ Table 'antilien' created successfully");
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS antibot (
                jid TEXT PRIMARY KEY,
                etat TEXT DEFAULT 'non',
                action TEXT DEFAULT 'delete'
            );
        `);
        console.log("✅ Table 'antibot' created successfully");
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS warn (
                jid TEXT PRIMARY KEY,
                count INTEGER DEFAULT 0
            );
        `);
        console.log("✅ Table 'warn' created successfully");
        
    } catch (error) {
        console.error("❌ Error creating tables:", error);
    } finally {
        client.release();
        pool.end();
    }
}

createTables();
