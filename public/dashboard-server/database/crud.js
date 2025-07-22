const pool = require('../db');
const format = require('pg-format');

// 🔒 Erlaubte Felder extrahieren
function filterFields(data, allowedFields) {
  const filtered = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

// 📥 Datensatz erstellen
async function create(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
}

// 📄 Alle Einträge abrufen
async function readAll(table, fields = ['*'], orderBy = 'id') {
  const query = format('SELECT %s FROM %I ORDER BY %I ASC', fields.join(', '), table, orderBy);
  const result = await pool.query(query);
  return result.rows;
}

// ✏️ Datensatz aktualisieren
async function updateById(table, id, data, allowedFields) {
  const filtered = filterFields(data, allowedFields);
  const keys = Object.keys(filtered);
  const values = Object.values(filtered);

  if (keys.length === 0) throw new Error('Keine gültigen Felder zum Aktualisieren.');

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  values.push(id);

  const query = `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
}

// ❌ Datensatz löschen
async function deleteById(table, id) {
  await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
}

module.exports = {
  create,
  readAll,
  updateById,
  deleteById,
  filterFields
};
