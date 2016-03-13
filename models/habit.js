var mongoose = require('mongoose');

var habitSchema = new mongoose.Schema({
  name: String,
  pointValue: Number
});

module.exports = mongoose.model('Habit', habitSchema);
