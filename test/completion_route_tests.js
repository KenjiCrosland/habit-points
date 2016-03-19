var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URI = 'mongodb://localhost/habitpoint_test';
require (__dirname + '/../server');
var mongoose = require('mongoose');
var Habit = require(__dirname + '/../models/habit');

describe('completion routes', function(){
  var testHabit;

  before(function(done){
    (new Habit({ name: 'Drink a glass of water', pointValue: 1, bonusInterval: 'Daily' })
      .save(function(err, data){
          testHabit = data;
          done();
      }));
  });

  after(function (done) {
    mongoose.connection.db.dropDatabase(function() {
    done();
    });
  });

  it('saves a habit to the database', function(done) {
    Habit.findOne({'name': 'Drink a glass of water'}, function(err, habit) {
      expect(habit.name).to.equal('Drink a glass of water');
      done();
    });
  });

  it('updates a habit with a habit completion', function(done) {
    var date = new Date().toUTCString();
    chai.request('localhost:3000')
    .post('/api/completions/' + testHabit._id)
    .send({completedOn: date})
    .end(function(err, res) {
      Habit.findOne({'_id': testHabit._id}, function(err, habit) {
        console.log(habit.intervals[0].completions[0].completedOn);
        expect(habit.intervals[0].completions[0].completedOn.toUTCString()).to.equal(date);
        done();
      });
    });
  });
});

