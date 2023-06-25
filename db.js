const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'id20765913_carlb6345',
  password: 'PillowChat9!',
  database: 'id20765913_sample_db'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Perform a sample query to retrieve data from a table
const query = 'SELECT * FROM users';
connection.query(query, (err, results) => {
  if (err) {
    console.error('Error executing the query:', err);
    return;
  }
  console.log('Query results:', results);
});

// Insert a new record into a table
/*
const newRecord = { name: 'John Doe', age: 30 };
connection.query('INSERT INTO users SET ?', newRecord, (err, result) => {
  if (err) {
    console.error('Error inserting the record:', err);
    return;
  }
  console.log('New record inserted:', result);
});
*/

// Close the database connection
connection.end((err) => {
  if (err) {
    console.error('Error closing the database connection:', err);
    return;
  }
  console.log('Database connection closed');
});
