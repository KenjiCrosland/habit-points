var mongoose = require('mongoose');
var express = require ('express');
var path = require('path');
var app = express();

var habitsRouter = require(__dirname + '/routes/habit_routes');
var completionsRouter = require(__dirname + '/routes/completion_routes')
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/habitpoints_app');

app.use('/api', habitsRouter);
app.use('/api', completionsRouter);
app.use(express.static(path.join(__dirname, 'build')));


var port = process.env.PORT || 3000

app.listen(port, function (){
  console.log('Server up & running on port: ' + port);
});
