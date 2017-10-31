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
		rows.push(<tr>
				    <td>{props.data[i].m_score}</td>
				    <td>{props.data[i].level}</td>
				    <td>
				    	<Button
				    		text="Report"
				    		style={tableButtonStyle}/>
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
	    	scores: undefined
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

	render() {
		var tableContent;
		if (this.state.scores) {
			tableContent = (<Rows
						  	data={this.state.scores}/>);
		} else {
			tableContent = (<p id="profile-no-scores">No scores found!</p>);
		}
		return (
			<div className="Profile">
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
					{tableContent}
				</div>
			</div>
		);
	}
}