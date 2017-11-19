import React, { Component } from 'react';
import Button from './Button';
import './Profile.css';
import { API } from './api';
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
		rows.push(<tr key={i}>
				    <td>{props.data[i].m_score}</td>
				    <td>{props.data[i].level}</td>
				    <td>
				    	<Button
				    		text="Report"
				    		id={i}
				    		style={tableButtonStyle}
				    		handleClick={props.handleButtonClick}/>
				    </td>
				  </tr>);
	}
	
	return (<table id="profile-score-info">
			  <thead>
			  	<tr>
				    <th>Latest scores</th>
				    <th>Map</th>
				    <th>Info</th>
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
	    this.setState({
			report: true
	    });
	}


	render() {
		var leftContent;
		var rightContent;
		if (this.state.scores) {
			console.log(this.state.scores)
			leftContent = (<Rows
						  	data={this.state.scores}
						  	handleButtonClick={this.handleButtonClick.bind(this)}/>);
		} else {
			leftContent = (<p id="profile-no-scores">No scores found!</p>);
		}

		if (this.state.report) {
			rightContent = (
				<div id="right-content">
					<h1>Report</h1>
					<div id="report">
						<div id="report-general">
							<p>19.11.2017, 16:00</p>
							<p>Map: Learning the ropes</p>
						</div>
						<div id="report-stats">
							<h2>Stats</h2>
							<p>Working time (hh:mm:ss):<span>00:15:26</span></p>
							<p>Logs collected:<span>12</span></p>
							<p>Distance travelled:<span>526m</span></p>
							<p>Fuel consumed:<span>8.26l</span></p>
							<hr/>
							<p><b>Final score:<span>23532</span></b></p>
						</div>
					</div>
				</div>
        	);
		}
		return (
			<div className="Profile">
				<div id="left-content">
					<div id="profile-header">
						<h1>Profile</h1>
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