const sqlite3 = require('sqlite3').verbose();

// Open a database handle
const db = new sqlite3.Database('./data.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

module.exports = db;