const db = require('../../data/db-config');

module.exports = {
  find,
  findBy,
  findById,
  add,
};

function find() {
  return db('users').select('user_id', 'username');
}

function findBy(filter) {
  return db('users').where(filter).orderBy('user_id');
}

function findById(user_id) {
  return db('users').select('user_id', 'username').where({ user_id }).first();
}

async function add(user) {
  const [user_id] = await db('users').insert(user);
  return findById(user_id);
}
