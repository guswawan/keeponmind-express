const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const connection = require('./connection');

//middleware
const myLogger = (_req, _res, next) => {
  console.log('LOGGED');
  next();
};

router.get('/', (_req, res) => {
  res.send('Hello World!');
});

//routing with data from database
router.get('/users', async (_req, res) => {
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

router.post('/user', async (req, res) => {
  try {
    if (connection) {
      const { name, age, status } = req.body;
      const db = connection.db('db_latihan');
      const users = await db.collection('users').insertOne({
        name,
        age,
        status,
      });
      if (insertedId) {
        res.send({ message: 'data berhasil ditambahkan.' });
      } else {
        res.send({ message: 'gagal menambah data.' });
      }
    } else {
      res.send({ message: 'koneksi database gagal.' });
    }
  } catch (err) {
    res.send({ message: err.message || 'internal server error' });
  }
});

router.put('/user/:id', async (req, res) => {
  try {
    if (connection) {
      const { id } = req.params;
      const { name, age, status } = req.body;
      const db = connection.db('db_latihan');
      const users = await db.collection('users').updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            name,
            age,
            status,
          },
        }
      );
      if (Number(users.modifiedCount) === 1) {
        res.send({ message: 'data berhasil diubah.' });
      } else {
        res.send({ message: 'gagal mengubah data.' });
      }
    } else {
      res.send({ message: 'koneksi database gagal.' });
    }
  } catch (err) {
    res.send({ message: err.message || 'internal server error' });
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    if (connection) {
      const { id } = req.params;
      const db = connection.db('db_latihan');
      const users = await db
        .collection('users')
        .deleteOne({ _id: ObjectId(id) });
      console.log('DEL', users);
      if (Number(users.deletedCount) === 1) {
        res.send({ message: 'data berhasil dihapus.' });
      } else {
        res.send({ message: 'gagal menghapus data.' });
      }
    } else {
      res.send({ message: 'koneksi database gagal.' });
    }
  } catch (err) {
    res.send({ message: err.message || 'internal server error' });
  }
});

module.exports = router;
