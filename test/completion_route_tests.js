var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var moment = require('moment');

process.env.MONGOLAB_URI = 'mongodb://localhost/habitpoint_test';
require (__dirname + '/../server');
var mongoose = require('mongoose');
var Habit = require(__dirname + '/../models/habit');

describe('completion POST routes', function(){
  var testHabit;

  before(function(done){
    (new Habit({ name: 'Drink a glass of water', pointValue: 1, bonusInterval: 'day' })
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
    var date = new Date();
    chai.request('localhost:3000')
    .post('/api/completions/' + testHabit._id)
    .send({completedOn: date})
    .end(function(err, res) {
      Habit.findOne({'_id': testHabit._id}, function(err, habit) {
        var completionTimestamp = habit.intervals[0].completions[0].completedOn;
        expect(completionTimestamp.toUTCString).to.equal(date.toUTCString);
        done();
      });
    });
  });

  it('creates a completion between start date and end date', function(done){
    Habit.findOne({'_id': testHabit._id}, function(err, habit) {
      var interval = habit.intervals[0];
      var completionTimestamp = interval.completions[0].completedOn;
      var momentTest = moment(completionTimestamp).isBetween(interval.intervalStart, interval.intervalEnd);
      expect(momentTest).to.equal(true);
      done();
    });
  });

  describe('a habit with an existing interval', function(){

    before(function(done){
      var date = moment(new Date()).add(2, 'days').toDate();
      var testHabit;

      (new Habit({
        name: 'Drink a glass of water',
        pointValue: 1,
        bonusInterval: 'day',
        intervals:[{
          allComplete: false,
          intervalEnd: moment().endOf('day').toDate(),
          intervalStart: moment().startOf('day').toDate(),
          completions: [{completedOn: Date.now()}, {completedOn: Date.now()}]
        }]
      }).save(function(err, data){
        testHabit = data;
        done();
      }));
    });

    it('creates a new interval if the completion falls outside the interval start and interval end timestamps', function(done){
      chai.request('localhost:3000')
      .post('/api/completions/' + testHabit._id)
      .send({completedOn: moment(new Date()).add(2, 'days').toDate()})
      .end(function(err, res) {
        Habit.findOne({'_id': testHabit._id}, function(err, habit) {
         // console.log(habit.intervals)
          //It's already creating another interval by default. We don't want that.
          expect(habit.intervals.length).to.equal(2);
          done();
        });
      });

    });
  });
});

