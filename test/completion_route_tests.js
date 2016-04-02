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
    var testHabit;
    beforeEach(function(){
     return new Habit({
      name: 'Drink a glass of water',
      pointValue: 1,
      bonusInterval: 'day',
      bonusFrequency: 4,
      intervals:[{
        allComplete: false,
        intervalEnd: moment().endOf('day').toDate(),
        intervalStart: moment().startOf('day').toDate(),
        completions: [{completedOn: Date.now()}, {completedOn: Date.now()}]
      }]
    }).save().then(function(habit){
      testHabit = habit;
    })
  });

    it('creates a new interval if the completion falls outside the interval start and interval end timestamps', function(){
      return chai.request('localhost:3000')
      .post('/api/completions/' + testHabit._id)
      .send({completedOn: moment(new Date()).add(2, 'days').toDate()})
      .then(function() {
        return Habit.findOne({'_id': testHabit._id})
        .then(function(habit) {
          expect(habit.intervals.length).to.equal(2);
        });
      });
    });

    it('does NOT create a new interval if the completion falls within the interval start and interval end timestamps', function(){
      return chai.request('localhost:3000')
      .post('/api/completions/' + testHabit._id)
      .send({completedOn: Date.now()})
      .then(function(res) {
        return Habit.findOne({'_id': testHabit._id})
        .then(function(habit) {
          expect(habit.intervals.length).to.equal(1);
        });
      });
    });

    it('changes an interval allComplete attribute to true when bonusFrequency goal is reached', function(){
      return chai.request('localhost:3000')
      .post('/api/completions/' + testHabit._id)
      .send({completedOn: Date.now})
      .then(function() {
        return chai.request('localhost:3000')
        .post('/api/completions/' + testHabit._id)
        .send({completedOn: Date.now})
        .then(function(){
          return Habit.findOne({'_id': testHabit._id})
          .then(function(habit){
            expect(habit.intervals[habit.intervals.length - 1].allComplete).to.equal(true);
          });
        })
      });
    });

    it('creates a new interval if the allComplete attribute is true', function(){
      return Habit.findOne({'_id': testHabit._id})
      .then(function(habit){
        habit.intervals[habit.intervals.length - 1].allComplete = true;
        return habit.save()
        .then(function(habit){
          return chai.request('localhost:3000')
          .post('/api/completions/' + habit._id)
          .send({completedOn: Date.now})
          .then(function(){
            return Habit.findOne({'_id': habit._id})
            .then(function(habit){
              expect(habit.intervals.length).to.equal(2);
            });
          });
        });
      });
    });

  });
});
