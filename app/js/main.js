var React = require('react');
var ReactDOM = require('react-dom');
if (typeof window !== 'undefined') {
    window.React = React;
}
var HabitTable = React.createClass({
	render: function() {
		var rows = [];
		this.props.habits.forEach(function(habit){
			rows.push(<HabitName key={habit._id} habit={habit} />, <HabitCompletions habit={habit}/>)
		});
		return (
			<table>
			<tbody>{rows}</tbody>
			</table>
		)
	}
});

var HabitName = React.createClass({
	render: function() {
		return (<tr><td>{this.props.habit.name}</td></tr>);
	}
});

var HabitCompletions = React.createClass({
	render: function() {
		var habit = this.props.habit;
		var recentCompletions = habit.intervals[habit.intervals.length - 1].completions;
		var listItems = [];
		var incomplete = 'Incomplete';
		var complete = 'Complete';
		for(var i = 0; i < habit.bonusFrequency; i++) {
			var completed = 'fa fa-check-circle-o';
			if (recentCompletions.length < i)  {
				completed = 'fa fa-circle-o';
				listItems.push(<CompletionButton completed={completed}/>);
				continue;
			};
			listItems.push(<CompletionButton completed={completed}/>);
		}
		return (
			<tr><td><ul>{listItems}</ul></td></tr>
		);
	}
});

var CompletionButton = React.createClass({
	render: function() {
		return (
			<li className={this.props.completed}></li>
		)
	}
})

var HABITS = [
{ intervals:
	[ { completions: [ { completedOn: 'Wed Apr 06 2016 19:52:48 GMT-0700 (PDT)',
	_id: '5705cb80b7fr05bf0e08b14b' },
	{ completedOn: 'Wed Apr 06 2016 19:52:48 GMT-0700 (PDT)',
	_id: '5705cb80b7f305btr0e08b14a' } ],
	_id: '5705cafe7ec8d5ea0e8e683f',
	intervalStart: 'Wed Apr 06 2016 00:00:00 GMT-0700 (PDT)',
	intervalEnd: 'Wed Apr 06 2016 23:59:59 GMT-0700 (PDT)',
	allComplete: false } ],
	_id: '5705cafe7ec8d59a0e8er83e',
	bonusFrequency: 4,
	bonusInterval: 'day',
	pointValue: 1,
	name: 'Drink a glass of water',
	__v: 0 },
{ intervals:
	[ { completions: [ { completedOn: 'Wed Apr 06 2016 19:52:48 GMT-0700 (PDT)',
	_id: '5705cb80b7f305bf0e08b14b' },
	{ completedOn: 'Wed Apr 06 2016 19:52:48 GMT-0700 (PDT)',
	_id: '5705cb80b7f305bf0e08b14a' } ],
	_id: '5705cafe7ec8d59a0e8e685f',
	intervalStart: 'Wed Apr 06 2016 00:00:00 GMT-0700 (PDT)',
	intervalEnd: 'Wed Apr 06 2016 23:59:59 GMT-0700 (PDT)',
	allComplete: false } ],
	_id: '5705cafe7ec8d59a0e8e689',
	bonusFrequency: 5,
	bonusInterval: 'day',
	pointValue: 2,
	name: 'Meditate for five minutes',
	__v: 0 },
{ intervals:
	[ { completions: [ { completedOn: 'Wed Apr 06 2016 19:52:48 GMT-0700 (PDT)',
	_id: '5705cb80b7f305bf8b14b' } ],
	_id: '5705cafe7ec8d59e685f',
	intervalStart: 'Wed Apr 06 2016 00:00:00 GMT-0700 (PDT)',
	intervalEnd: 'Wed Apr 06 2016 23:59:59 GMT-0700 (PDT)',
	allComplete: false } ],
	_id: '5705cafe7ec8d59e689',
	bonusFrequency: 7,
	bonusInterval: 'day',
	pointValue: 2,
	name: 'Floss yer teeths',
	__v: 0 }

];

ReactDOM.render(
	<HabitTable habits={HABITS} />,
	document.getElementById('content')
)