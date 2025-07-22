const pool = require('../db');
const format = require('pg-format');

function filterFields(data, allowedFields) {
  const filtered = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

function handleError(error, context) {
  console.error(`[DB Error] ${context}:`, error.message);
  const knownErrors = [
    'syntax error',
    'duplicate key',
    'violates foreign key constraint',
    'no valid fields'
  ];

  return {
    status: 500,
    message: knownErrors.some(err => error.message.toLowerCase().includes(err))
      ? `Fehler in ${context}: ${error.message}`
      : 'Interner Serverfehler'
  };
}

async function create(table, data) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const result = await pool.query(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (err) {
    throw handleError(err, `create(${table})`);
  }
}

async function readAll(table, fields = ['*'], orderBy = 'id') {
  try {
    const query = format('SELECT %s FROM %I ORDER BY %I ASC', fields.join(', '), table, orderBy);
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw handleError(err, `readAll(${table})`);
  }
}

async function updateById(table, id, data, allowedFields) {
  try {
    const filtered = filterFields(data, allowedFields);
    const keys = Object.keys(filtered);
    const values = Object.values(filtered);

    if (keys.length === 0) {
      throw { status: 400, message: 'Keine gültigen Felder zum Aktualisieren.' };
    }

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (err) {
    throw handleError(err, `updateById(${table})`);
  }
}

async function deleteById(table, id) {
  try {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  } catch (err) {
    throw handleError(err, `deleteById(${table})`);
  }
}

module.exports = {
  create,
  readAll,
  updateById,
  deleteById,
  filterFields
};
