require("dotenv").config();
const { Pool } = require("pg");
let s = require("../set");

var dbUrl = s.DATABASE_URL
  ? s.DATABASE_URL
  : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});


// 🔹 Create table if not exists
async function createAntilienTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS antilien (
        jid TEXT PRIMARY KEY,
        etat TEXT DEFAULT 'non',
        action TEXT DEFAULT 'remove'
      );
    `);
    console.log("Antilien table ready.");
  } catch (error) {
    console.error("Error creating antilien table:", error);
  } finally {
    client.release();
  }
}

createAntilienTable();


// 🔹 Activate / Deactivate antilink
async function ajouterOuMettreAJourJid(jid, etat) {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO antilien (jid, etat)
      VALUES ($1, $2)
      ON CONFLICT (jid)
      DO UPDATE SET etat = EXCLUDED.etat;
    `, [jid, etat]);

    console.log(`Antilink updated for ${jid}`);
  } catch (error) {
    console.error("Error updating antilink:", error);
  } finally {
    client.release();
  }
}


// 🔹 Change action (remove or delete)
async function mettreAJourAction(jid, action) {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO antilien (jid, action)
      VALUES ($1, $2)
      ON CONFLICT (jid)
      DO UPDATE SET action = EXCLUDED.action;
    `, [jid, action]);

    console.log(`Action updated for ${jid}`);
  } catch (error) {
    console.error("Error updating action:", error);
  } finally {
    client.release();
  }
}


// 🔹 Check if antilink is ON
async function verifierEtatJid(jid) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      "SELECT etat FROM antilien WHERE jid = $1",
      [jid]
    );

    if (!rows.length) return false;

    return rows[0].etat?.toLowerCase() === "oui";

  } catch (err) {
    console.error("Error checking antilink:", err);
    return false;
  } finally {
    client.release();
  }
}


// 🔹 Get action
async function recupererActionJid(jid) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      "SELECT action FROM antilien WHERE jid = $1",
      [jid]
    );

    if (!rows.length) return "remove";

    return rows[0].action;

  } catch (error) {
    console.error("Error getting action:", error);
    return "remove";
  } finally {
    client.release();
  }
}


module.exports = {
  mettreAJourAction,
  ajouterOuMettreAJourJid,
  verifierEtatJid,
  recupererActionJid,
};