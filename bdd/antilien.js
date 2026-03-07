require("dotenv").config();
const { Pool } = require("pg");
let s = require("../set")
var dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9"

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Fonction pour créer la table "antilien"
async function createAntilienTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS antilien (
        jid text PRIMARY KEY,
        etat text,
        action text
      );
    `);
    console.log("✅ Table 'antilien' created successfully.");
  } catch (error) {
    console.error("❌ Error creating 'antilien' table:", error);
  } finally {
    client.release();
  }
}

// Create table on startup
createAntilienTable();

// Add or update JID with status
async function ajouterOuMettreAJourJid(jid, etat) {
  const client = await pool.connect();
  
  try {
    const result = await client.query('SELECT * FROM antilien WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      await client.query('UPDATE antilien SET etat = $1 WHERE jid = $2', [etat, jid]);
      console.log(`✅ Updated status for ${jid} to ${etat}`);
    } else {
      // Changed default action from 'supp' to 'delete'
      await client.query('INSERT INTO antilien (jid, etat, action) VALUES ($1, $2, $3)', [jid, etat, 'delete']);
      console.log(`✅ Added ${jid} with status ${etat} and action delete`);
    }
  } catch (error) {
    console.error('❌ Error in ajouterOuMettreAJourJid:', error);
  } finally {
    client.release();
  }
}

// Update action for a JID
async function mettreAJourAction(jid, action) {
  const client = await pool.connect();
  
  try {
    const result = await client.query('SELECT * FROM antilien WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      await client.query('UPDATE antilien SET action = $1 WHERE jid = $2', [action, jid]);
      console.log(`✅ Updated action for ${jid} to ${action}`);
    } else {
      // Changed default status from 'non' to 'oui' when setting action
      await client.query('INSERT INTO antilien (jid, etat, action) VALUES ($1, $2, $3)', [jid, 'oui', action]);
      console.log(`✅ Added ${jid} with status oui and action ${action}`);
    }
  } catch (error) {
    console.error('❌ Error in mettreAJourAction:', error);
  } finally {
    client.release();
  }
}

// Check if antilink is enabled for a JID
async function verifierEtatJid(jid) {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT etat FROM antilien WHERE jid = $1', [jid]);
    
    if (result.rows.length > 0) {
      const etat = result.rows[0].etat;
      return etat === 'oui';
    } else {
      return false; // Not enabled by default
    }
  } catch (error) {
    console.error('❌ Error in verifierEtatJid:', error);
    return false;
  } finally {
    client.release();
  }
}

// Get action for a JID
async function recupererActionJid(jid) {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT action FROM antilien WHERE jid = $1', [jid]);
    
    if (result.rows.length > 0) {
      const action = result.rows[0].action;
      return action;
    } else {
      // Changed default from 'supp' to 'delete'
      return 'delete';
    }
  } catch (error) {
    console.error('❌ Error in recupererActionJid:', error);
    return 'delete'; // Default action on error
  } finally {
    client.release();
  }
}

// Get all antilink settings
async function getAllAntilienSettings() {
  const client = await pool.connect();
  
  try {
    const result = await client.query('SELECT * FROM antilien');
    return result.rows;
  } catch (error) {
    console.error('❌ Error in getAllAntilienSettings:', error);
    return [];
  } finally {
    client.release();
  }
}

// Delete a JID from antilien table
async function supprimerJid(jid) {
  const client = await pool.connect();
  
  try {
    await client.query('DELETE FROM antilien WHERE jid = $1', [jid]);
    console.log(`✅ Deleted ${jid} from antilien table`);
    return true;
  } catch (error) {
    console.error('❌ Error in supprimerJid:', error);
    return false;
  } finally {
    client.release();
  }
}

module.exports = {
  mettreAJourAction,
  ajouterOuMettreAJourJid,
  verifierEtatJid,
  recupererActionJid,
  getAllAntilienSettings,
  supprimerJid
};
