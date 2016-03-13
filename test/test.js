var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URI = 'mongodb://localhost/habitpoint_test';
require (__dirname + '/../server');
var mongoose = require('mongoose');
var Habit = require(__dirname + '/../models/habit');

describe('the habit points app', function() {
  var testHabit;

  before(function(done) {
    (new Habit({ name: 'Drink a glass of water', pointValue: 1 })
      .save(function(err, data){
        expect(err).to.eql(null);
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

    it('retrieves a single habit from the database with a GET route and id', function(done) {
      chai.request('localhost:3000')
      .get('/api/habits/' + testHabit._id)
      .end(function(err, res) {
        expect(res.body.name).to.equal('Drink a glass of water');
        done();
      });
    });

    it('saves a habit to the database with a POST request', function(done) {
      var habitData = { name: 'Floss your teeth', pointValue: 2 };
      chai.request('localhost:3000')
      .post('/api/habits')
      .send(habitData)
      .end(function(err, res) {
        Habit.findOne({'name': 'Floss your teeth'}, function(err, habit) {
          expect(habit.name).to.equal('Floss your teeth');
          done();
        });
      });
    });

    it('retrieves all habits if no id is provided', function(done) {
      chai.request('localhost:3000')
      .get('/api/habits')
      .end(function(err, res) {
        expect(res.body.length).to.be.above(1);
        expect(res.body[0].name).to.equal('Drink a glass of water');
        expect(res.body[1].name).to.equal('Floss your teeth');
        done();
      });
    });

    it('updates a habit with a PUT request', function(done) {
      chai.request('localhost:3000')
      .put('/api/habits/' + testHabit._id)
      .send({ name: 'Drink a glass of water mindfully and slowly' })
      .end(function(err, res) {
        Habit.findOne({'_id': testHabit._id}, function(err, habit) {
          expect(habit.name).to.equal('Drink a glass of water mindfully and slowly');
          done();
        });
      });
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
})
