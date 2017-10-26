import React, { Component } from 'react';
import Button from './Button';
import './Profile.css';
import Icon from 'react-icons-kit';
import { user } from 'react-icons-kit/icomoon/user';
import { mail } from 'react-icons-kit/icomoon/mail';

export default class Profile extends Component {
	constructor(props) {
	    super(props);
    }
	render() {
		var tableButtonStyle = {
			height: '30px',
			lineHeight: '30px',
			width: '100px',
			backgroundColor: 'var(--jd-yellow)'
		}
		return (
			<div className="Profile">
				<div id="profile-header">
					<h1>Profile</h1>
				</div>
				<hr></hr>
				<div id="user-info">
					<div id="user-info-username">
						<Icon size={16} icon={user} id="user-info-username-icon"/>
						<h2 id="user-info-username-header">{this.props.username}</h2>
					</div>
					<div id="user-info-email">
						<Icon size={16} icon={mail} id="user-info-email-icon" />
						<p id="user-info-email-paragraph">{this.props.email}</p>
					</div>
				</div>
				<div id="profile-content">
					<table id="profile-score-info">
					  <tr>
					    <th>Latest scores</th>
					    <th>Info</th>
					  </tr>
					  <tr>
					    <td>97.00</td>
					    <td>
					    	<Button
					    		text="Report"
					    		style={tableButtonStyle}/>
					    </td>
					  </tr>
					  <tr>
					    <td>103.06</td>
					    <td>
					    	<Button
					    		text="Report"
					    		style={tableButtonStyle}/>
					    </td>
					  </tr>
					  <tr>
					    <td>55.00</td>
					    <td>
					    	<Button
					    		text="Report"
					    		style={tableButtonStyle}/>
					    </td>
					  </tr>
					  <tr>
					    <td>55.00</td>
					    <td>
					    	<Button
					    		text="Report"
					    		style={tableButtonStyle}/>
					    </td>
					  </tr>
					  <tr>
					    <td>55.00</td>
					    <td>
					    	<Button
					    		text="Report"
					    		style={tableButtonStyle}/>
					    </td>
					  </tr>
					</table>
				</div>
			</div>
		);
	}
}