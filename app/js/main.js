var React = require('react');
var ReactDOM = require('react-dom');
if (typeof window !== 'undefined') {
    window.React = React;
}



var HabitsListScreen = React.createClass({
	getInitialState: function(){
		return {data: []}
	},
	componentDidMount: function(){
		this.loadHabitsFromServer();
	},
	loadHabitsFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}
		});
	},
	createCompletion: function(habitId){
		var completionUrl = "api/completions/" + habitId;
		$.ajax({
			type:"POST",
			url: completionUrl,
			cache: false,
			success: function() {
				this.loadHabitsFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(completionUrl, status, err.toString());
			}
		})
	},
	render: function(){
		return (<HabitTable habits={this.state.data} onHabitCompletion={this.createCompletion} />);
	}
});

var HabitTable = React.createClass({
	render: function() {
		var onHabitCompletion = this.props.onHabitCompletion;
		return (
			<table>
				{this.props.habits.map(function(habit){
					return <HabitCompletions key={habit._id} habit={habit} onHabitCompletion={onHabitCompletion}/>
				})}
			</table>
		);
	}
});

var HabitCompletions = React.createClass({
	render: function() {
		var habit = this.props.habit;
		var recentCompletions;
		if (!habit.intervals[habit.intervals.length - 1]){
			recentCompletions = [];
		} else { 
			recentCompletions = habit.intervals[habit.intervals.length - 1].completions;
		}
		var listItems = [];
		for(var i = 0; i < habit.bonusFrequency; i++) {
			var completed;
			if (recentCompletions.length <= i)  {
				completed = false;
				//TODO: Do something with checkboxes
			} else {
				completed = true;
			}
			listItems.push(<CompletionButton checked={completed} habit={habit} onHabitCompletion={this.props.onHabitCompletion}/>);
		}
		return (
			<tbody>
			<tr><td>{habit.name}</td></tr>
			<tr><td><form id={habit._id}><ul>{listItems}</ul></form></td></tr>
			</tbody>
		);
	}
});

var CompletionButton = React.createClass({
  getInitialState: function () {
    return {
        checked: this.props.checked || false
     };
  },
	render: function() {
		var createCompletion = this.props.onHabitCompletion;
		var habitId = this.props.habit._id;
		var toggleCheck = this.toggleCheck;
		return (
			<li>
			<label>
			<input type="checkbox" 
				checked={this.props.checked}
				onChange={function(e){
					toggleCheck(e);
					createCompletion(habitId);
				}}
				/>
			</label>
			</li>
		)
	},
	toggleCheck: function(e){
		this.setState({checked: e.target.checked});
	}
});

ReactDOM.render(
	<HabitsListScreen url="/api/habits" />,
	document.getElementById('content')
)