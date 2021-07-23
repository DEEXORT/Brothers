const index = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const api = require('./api');
const hash = require('./hashApp.js');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'mysql',
  password: 'mysql',
  database: 'database'
});

db.connect();
db.query("SET SESSION wait_timeout = 604800");

const port = process.env.PORT || 8080;

const app = index()
  .use(cors())
  .use(bodyParser.json())
  .use(api(db));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
