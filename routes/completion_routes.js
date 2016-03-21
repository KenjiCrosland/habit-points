var express = require('express');
var bodyParser = require('body-parser');
var Habit = require(__dirname + '/../models/habit');
var handleServerError = require(__dirname + '/../lib/handle_server_error');
var moment = require('moment');

var completionsRouter = module.exports = express.Router();

completionsRouter.post('/completions/:id', bodyParser.json(), function(req, res) {
  var habitData = req.body;
  Habit.findOne({_id: req.params.id}, function(err, data) {
    if (err) return handleServerError(err, res);
    if (!data.intervals.length || moment(data.intervals[data.intervals.length - 1].intervalEnd).isBefore(habitData.completedOn)){
      data.intervals.push({
        intervalStart: moment().startOf(data.bonusInterval).toDate(),
        intervalEnd:moment().endOf(data.bonusInterval).toDate(),
        allComplete: false,
        completions:[]
      });
    }
    if (data.intervals.length){
    data.intervals[data.intervals.length - 1].completions.push({
      completedOn: habitData.completedOn,
      pointValue: data.pointValue
    });
    }
    data.save()
    res.json({msg: 'Update successful!'});
  });
});
