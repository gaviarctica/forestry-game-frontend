import React, { Component } from 'react';
import Button from './Button';
import './Profile.css';
import { API } from './api';
import { LANG } from './lang';
import Icon from 'react-icons-kit';
import { user } from 'react-icons-kit/icomoon/user';
import { mail } from 'react-icons-kit/icomoon/mail';

const Rows = (props) => {
	var rows = [];

	var tableButtonStyle = {
		height: '30px',
		lineHeight: '30px',
		width: '100px',
		backgroundColor: 'var(--jd-yellow)'
	}

	for (let i = 0; i < props.data.length; i++) {
		rows.push(<tr key={props.data[i].id}>
				    <td>{props.data[i].m_score}</td>
				    <td>{props.data[i].level}</td>
				    <td>
				    	<Button
				    		text={LANG[props.lang].buttons.report}
				    		id={props.data[i].id}
				    		style={tableButtonStyle}
				    		handleClick={props.handleButtonClick}/>
				    </td>
				  </tr>);
	}
	
	return (<table id="profile-score-info">
			  <thead>
			  	<tr>
				    <th>{LANG[props.lang].mainMenu.profileTab.latestScores}</th>
				    <th>{LANG[props.lang].mainMenu.profileTab.map}</th>
				    <th>{LANG[props.lang].mainMenu.profileTab.info}</th>
				</tr>
			  </thead>
			  <tbody>
			  	{rows}
			  </tbody>
			</table>);
}

export default class Profile extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	scores: undefined,
			report: undefined
	    }
    }

	componentDidMount() {
		var self = this;
	    API.getMyLatestScores(function(err, responseJson) {
	      if (err) throw err;
	      if (responseJson.length > 0) {
	      	self.setState({
		        scores: responseJson
		    });
	      } else {
	      	self.setState({
		        scores: undefined
		    });
	      }
	    });
	}

	handleButtonClick(e) {
		var id = e.target.getAttribute('id');
		var content;
		for (let i = 0; i < this.state.scores.length; i++) {
			if (Number(this.state.scores[i].id) === Number(id)) {
				content = this.state.scores[i];
				break;
			}
		}
	    this.setState({
			report: true,
			content: content
	    });
	}

	render() {
		var leftContent;
		var rightContent;
		if (this.state.scores) {
			leftContent = (<Rows
						  	data={this.state.scores}
						  	handleButtonClick={this.handleButtonClick.bind(this)}
							lang={this.props.lang} />);
		} else {
			leftContent = (
				<p id="profile-no-scores">
					{LANG[this.props.lang].mainMenu.profileTab.noScoresFound}
				</p>
			);
		}

		if (this.state.report) {

			//Date when game finished
			var date = new Date(this.state.content.timestamp);

			//Working time
			var newdate = new Date(null);
			newdate.setSeconds(this.state.content.duration);
			var workingtime = newdate.toISOString().substr(11,8);

			rightContent = (
				<div id="right-content">
					<h1>{LANG[this.props.lang].report.report}</h1>
					<div id="report">
						<div id="report-general">
							<p>{date.getDate()}.{date.getMonth()}.{date.getFullYear()}, {date.getHours()}:{date.getMinutes()<10?'0':''}{date.getMinutes()}</p>
							<p>{LANG[this.props.lang].report.map}: {this.state.content.level}</p>
						</div>
						<div id="report-stats">
							<h2>{LANG[this.props.lang].report.stats}</h2>
							<p>{LANG[this.props.lang].report.workingTime}:<span>{workingtime}</span></p>
							<p>{LANG[this.props.lang].report.distanceTravelled}:<span>{this.state.content.distance}m</span></p>
							<p>{LANG[this.props.lang].report.fuelConsumed}:<span>{this.state.content.gas_consumption}l</span></p>
							<h3>{LANG[this.props.lang].report.logsCollected}:</h3>
							<ul>
								{this.state.content.logs.map(function(logs, index) {
									return <li key={index}>{logs.name}: <span>{logs.amount}</span></li>
								})}
							</ul>
							<hr/>
							<p><b>{LANG[this.props.lang].report.finalScore}:<span>{this.state.content.m_score}</span></b></p>
						</div>
					</div>
				</div>
        	);
		}
		return (
			<div className="Profile">
				<div id="left-content">
					<div id="profile-header">
						<h1>{LANG[this.props.lang].mainMenu.profileTab.profile}</h1>
					</div>
					<hr></hr>
					<div id="user-info">
						<div id="user-info-username">
							<Icon size={'1.3em'} icon={user} id="user-info-username-icon"/>
							<h2 id="user-info-username-header">{this.props.username}</h2>
						</div>
						<div id="user-info-email">
							<Icon size={'1.3em'} icon={mail} id="user-info-email-icon" />
							<p id="user-info-email-paragraph">{this.props.email}</p>
						</div>
					</div>
					<div id="profile-content">
						{leftContent}
					</div>
				</div>
				{rightContent}
			</div>
		);
	}
}