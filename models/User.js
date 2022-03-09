const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'nama wajib diisi'] },
  age: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'non active'],
    default: 'non active',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
