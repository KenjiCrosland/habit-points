var express = require('express');
var bodyParser = require('body-parser');
var Habit = require(__dirname + '/../models/habit');
var handleServerError = require(__dirname + '/../lib/handle_server_error');

var completionsRouter = module.exports = express.Router();

completionsRouter.post('/completions/:id', bodyParser.json(), function(req, res) {
  var habitData = req.body;
  console.log(habitData.completedOn);
  Habit.findOne({_id: req.params.id}, function(err, data) {
    if (err) return handleServerError(err, res);

    data.intervals.push({intervalStart: habitData.completedOn, allComplete: false, completions:[]})
    data.intervals[0].completions.push({completedOn: habitData.completedOn, pointValue: data.pointValue});
        console.log(data.intervals[0].completions);
    data.save()
    res.json({msg: 'Update successful!'});
  });
});
