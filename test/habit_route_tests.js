var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URI = 'mongodb://localhost/habitpoints_test';
require (__dirname + '/../server');
var mongoose = require('mongoose');
var Habit = require(__dirname + '/../models/habit');

describe('the habit routes', function() {
  var testHabit;

  before(function(done) {
    (new Habit({ name: 'Drink a glass of water', pointValue: 1, bonusInterval: 'Daily', bonusFrequency: 6 })
      .save(function(err, data){
        //expect(err).to.eql(null);
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

  describe('habit routes', function() {
    var testHabit2;
    before(function(done) {
      (new Habit({ name: 'Floss your teeth', pointValue: 2, bonusInterval: 'week', bonusFrequency: 7 })
        .save(function(err, data){
          testHabit2 = data;
          done();
      }));
    });

    describe('GET requests', function() {
        it('retrieves a single habit from the database with id', function(done) {
          chai.request('localhost:3000')
          .get('/api/habits/' + testHabit2._id)
          .end(function(err, res) {
            expect(res.body.name).to.equal('Floss your teeth');
            done();
          });
        });

        it('retrieves all habits without an id with a GET request', function(done) {
          chai.request('localhost:3000')
          .get('/api/habits')
          .end(function(err, res) {
            expect(res.body).to.be.instanceof(Array);
            done();
          });
        });
    });

    describe('a POST request', function(){

      before(function(done){
        var habitData = { name: 'Go to bed early', pointValue: 3, bonusInterval: 'week', bonusFrequency: 7 };
        chai.request('localhost:3000')
        .post('/api/habits')
        .send(habitData)
        .end(function(err, res) {
          done();
        });
      });

      it('saves a habit to the database with a POST request', function(done) {
            Habit.findOne({'name': 'Go to bed early'}, function(err, habit) {
              expect(habit.name).to.equal('Go to bed early');
              done();
            });
      });

      it('saves a timestamp to the habit', function(done){
          Habit.findOne({'name': 'Go to bed early'}, function(err, habit) {
              expect(habit.startDate).to.be.instanceof(Date);
              done();
            });
      })


    });

    describe('a PUT request', function(){
      var testHabit;

      before(function(done) {
        (new Habit({ name: 'Drink a big glass of water', pointValue: 1, bonusInterval: 'day', bonusFrequency: 6 })
          .save(function(err, data){
            //expect(err).to.eql(null);
            testHabit = data;
            done();
        }));
      });

      it('updates a habit', function(done) {
        chai.request('localhost:3000')
        .put('/api/habits/' + testHabit._id)
        .send({ name: 'Drink a big glass of water mindfully and slowly' })
        .end(function(err, res) {
          Habit.findOne({'_id': testHabit._id}, function(err, habit) {
            expect(habit.name).to.equal('Drink a big glass of water mindfully and slowly');
            done();
          });
        });
      });
    });

    describe('a DELETE request', function(){
     var testHabit;
      before(function(done) {
        (new Habit({ name: '10 minutes of light exercise', pointValue: 3, bonusInterval: 'week', bonusFrequency: 5 })
          .save(function(err, data){
            //expect(err).to.eql(null);
            testHabit = data;
            done();
        }));
      });

      it('deletes a habit with a DELETE request', function(done) {
          chai.request('localhost:3000')
          .delete('/api/habits/' + testHabit._id)
          .end(function(err, res) {
            expect(res.body.msg).to.equal('Delete successful!');
            done();
          });
        });
    });
  });
})
