const index = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const api = require('./api');
const jwt = require('jsonwebtoken');
const upload = require('./upload')

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

const JWT_Secret = 'Baseball';
const authAdmin = {login: 'admin', password: 'admin'};

app.post('/api/auth', (req, res) => {
  if (req.body) {
    const user = req.body;
    console.log('req.login=' + req.body.login + ', req.password=' + req.body.password);

    if (authAdmin.login === req.body.login && authAdmin.password === req.body.password) {
      const token = jwt.sign(user, JWT_Secret);
      res.status(200).send({
        signed_user: user,
        token: token
      });
    } else {
      res.status(403).send({
        errorMessage: 'Ошибка авторизации!'
      });
    }
  } else {
    res.status(403).send({
      errorMessage: 'Укажите логин и пароль'
    });
  }
});

//Загрузка изображений в файловую систему сервера
app.post('/api/upload', upload);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
