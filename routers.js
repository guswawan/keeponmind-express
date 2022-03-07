const express = require('express');
const router = express.Router();
const connection = require('./connection');

//middleware
const myLogger = (req, res, next) => {
  console.log('LOGGED');
  next();
};

router.get('/', (req, res) => {
  res.send('Hello World!');
});

//routing with data from database
router.get('/users', async (req, res) => {
  try {
    if (connection) {
      const db = connection.db('db_latihan');
      const users = await db.collection('users').find().toArray();
      res.send({ data: users });
    } else {
      res.send({ message: 'koneksi database gagal.' });
    }
  } catch (err) {
    res.send({ message: err.message || 'internal server error' });
  }
});

//routing with params
router.get('/user/:id', myLogger, (req, res) => {
  const id = Number(req.params.id);
  if (id === 1) {
    const user = {
      id: 1,
      name: 'Agus',
      age: 25,
    };
    res.send(user);
  } else {
    const user = {
      id: 2,
      name: 'Ayu',
      age: 23,
    };
    res.send(user);
  }
});

//routing with query string
router.get('/user', (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.query;
  const { age } = req.query;

  res.send(`Nama: ${name} & usia: ${age}`);
});

router.post('/user', (req, res) => {
  res.send('Got a POST request /user');
});

router.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user');
});

module.exports = router;
