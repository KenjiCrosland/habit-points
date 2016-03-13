var express = require('express');
var bodyParser = require('body-parser');
var Habit = require(__dirname + '/../models/habit');
var handleServerError = require(__dirname + '/../lib/handle_server_error');

var habitsRouter = module.exports = express.Router();


habitsRouter.get('/habits', function(req, res) {
  Habit.find({}, function(err, data) {
    if (err) return handleServerError(err, res);
    res.json(data);
  })
});

habitsRouter.get('/habits/:id', function(req, res) {
  Habit.findOne({_id: req.params.id}, function(err, data) {
    if (err) return handleServerError(err, res);
    res.json(data);
  });
});

habitsRouter.post('/habits', bodyParser.json(), function(req, res) {
  var newHabit = new Habit(req.body);
  newHabit.save(function(err, data) {
    if (err) return handleServerError(err, res);
    res.json(data);
  });
});

habitsRouter.put('/habits/:id', bodyParser.json(), function(req, res) {
  var habitData = req.body;
  Habit.update({ _id: req.params.id }, habitData, function(err) {
    if (err) return handleServerError(err, res);

    res.json({msg: 'Habit updated!'});
  });
});

habitsRouter.delete('/habits/:id', function(req, res) {
  Habit.remove({_id: req.params.id}, function(err) {
    if (err) return handleError(err, res);
    res.json({msg:'Delete successful!'});
  });
});
