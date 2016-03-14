var mongoose = require('mongoose');

var habitSchema = new mongoose.Schema({
  name: String,
  //Start Date and End Date for the bonus interval period.
  startDate: Date,
  endDate: Date,
  pointValue: Number,
  //Bonus interval: Daily, Weekly, Monthly
  bonusInterval: String,
  bonusFrequency: Number,
  intervals: [{
    intervalStart: Date,
    intervalEnd: Date,
    allComplete: Boolean,
    completions: [{
      completedOn: Date,
      pointValue: Number
    }]
  }]
});

module.exports = mongoose.model('Habit', habitSchema);
