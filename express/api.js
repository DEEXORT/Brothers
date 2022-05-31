const express = require('express');

function createRouter(db) {
  const router = express.Router();

  router.post('/api/get', function (req, res, next) {
      const table = req.body.table;
      let paramsSelect = '*';

      if (req.body.select) {
        paramsSelect = req.body.select;
      }

      let requestString = `SELECT ${paramsSelect} FROM ${table}`;

      if (req.body.filters) {
        const key = req.body.target.key;
        const value = req.body.target.value;
        requestString += ` ORDER BY ${key} ${value}`;
      }

      if (req.body.join) {
        const main_table = table;
        const tables = req.body.join; // [{typeJoin: 'INNER', name: 'games', columnName: 'game_id'}, {typeJoin: 'INNER', name: 'players', columnName: 'player_id'}]

        for (let table of tables){
          const typeJoin = table.typeJoin;
          const name = table.name;
          const columnName = table.columnName;
          requestString += ` ${typeJoin} JOIN ${name} ON ${main_table}.${columnName} = ${name}.id`;
        }
      }

    if (req.body.target) {
      const targets = req.body.target;
      // [{key: 'game_id', operator: '=', value: '25', log_operator: 'OR'},
      // {key: 'game_id', operator: '=', value: '13'}]
      let target_sql = '';

      for (let target of targets) {
        const key = target.key;
        const value = target.value;
        console.log(value);
        const operator = target.operator === undefined ? '=' : target.operator;
        const log_operator = target.log_operator === undefined ? '' : target.log_operator;
        const addition = target.addition === undefined ? '' : target.addition;
        target_sql += `${key} ${operator} ${value} ${log_operator} ${addition}`;
      }
      requestString += ` WHERE ${target_sql}` ;
    }

      db.query(requestString, (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
          } else {
            res.status(200).json(results);
          }
        }
      );
    }
  );

  router.post('/api/login', function (req, res, next) {
    const login = req.body.login;

    db.query(
      `SELECT * FROM players WHERE login = '${login}'`,
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'})
        } else {
          res.status(200).json(results);
        }
      }
    )
  });

  router.post('/api/get_all', function (req, res, next) {
    const table = req.body.table;
    const filters = req.body.filters;

    db.query(
      `SELECT * FROM ${table} ORDER BY ${filters} ASC`,
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error});
        } else {
          if (filters === 'date') {

          }
          console.log(results);
          res.status(200).json(results);
        }
      }
    );
  });

  router.post('/api/save', function (req, res, next) {
    let column = '';
    let charQuestion = '';
    let values = [];
    const table = req.body.table;

    for (let key of Object.keys(req.body.data)) {
      column += `${key}, `;
      charQuestion += `?, `;
      const value = req.body.data[key];

      if (typeof value === 'array' || typeof value === 'object') {
        console.log(JSON.stringify(value));
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
    }

    column = column.slice(0, column.length - 2)
    charQuestion = charQuestion.slice(0, charQuestion.length - 2)

    db.query(
      `INSERT INTO ${table} (${column}) VALUES (${charQuestion})`, values,
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  router.post('/api/update', function (req, res, next) {
    const table = req.body.table;
    const id = req.body.id;
    const data = req.body.data;
    const key = req.body.key;
    let columns = '';

    for (let key of Object.keys(data)) {
      columns += `${key} = '${data[key]}', `;
    }

    columns = columns.slice(0, columns.length - 2)

    db.query(
      `UPDATE ${table} SET ${columns} WHERE ${key} = ${id}`,
      [req.body.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  router.post('/api/delete', function (req, res, next) {
    const table = req.body.table;
    const id = req.body.id;
    const key = req.body.key;

    db.query(
      `DELETE FROM ${table} WHERE ${key} = ${id}`,
      [req.body.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;
