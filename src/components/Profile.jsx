import React, { Component } from 'react';
import Button from './Button';
import './Profile.css';
import Report from './Report';
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
		width: '100%',
		fontSize: '1em',
		boxShadow: 'var(--menu-shadow-2)',
		borderRadius: '5px',
		backgroundColor: 'var(--jd-yellow)'
	}

	for (let i = 0; i < props.data.length; i++) {
		rows.push(<tr key={props.data[i].id}>
				    <td>{props.data[i].m_score} €</td>
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
				    <th>{LANG[props.lang].mainMenu.profileTab.cost}</th>
				    <th>{LANG[props.lang].mainMenu.profileTab.map}</th>
				    <th style={{"width": "100px"}}>{LANG[props.lang].mainMenu.profileTab.info}</th>
				</tr>
			  </thead>
			  <tbody>
			  	{rows}
			  </tbody>
			</table>);
}

export default class Profile extends Component {
	constructor(props) {
		var detailedStats = (
			<div>
	          <h3>{LANG[props.lang].detailedReport.time}</h3>
	          <p>{LANG[props.lang].detailedReport.workingTime}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.drivingUnloadedTime}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.loadingTime}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.drivingLoadedTime}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.unloadingTime}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.idling}: <span>...</span></p>

	          <h3>{LANG[props.lang].detailedReport.distance}</h3>
	          <p>{LANG[props.lang].detailedReport.distanceTravelled}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.drivingForwardTime}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.drivingBackwardTime}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.drivingUnloadedDistance}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.drivingLoadedDistance}: <span>...</span></p>

	          <h3>{LANG[props.lang].detailedReport.costAndProductivity}</h3>
	          <p>{LANG[props.lang].detailedReport.fuelConsumed}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.fuelCost}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.workerSalary}: <span>...</span></p>
	          <br/>
	          <p>{LANG[props.lang].detailedReport.loadsTransported}: <span>...</span></p>
	          <p>{LANG[props.lang].detailedReport.productivity}: <span>...</span></p>
	        </div>
        );
	    super(props);
	    this.state = {
	    	scores: undefined,
			report: undefined,
			openedReport: undefined,
			detailedStats: detailedStats
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

		if (this.state.openedReport) {
			this.state.openedReport.style['background-color'] = 'var(--jd-yellow)';
			this.setState({
				openedReport: undefined
			})
		}

		var id = e.target.getAttribute('id');
		e.target.style['background-color'] = 'var(--jd-green)';
		var content;
		for (let i = 0; i < this.state.scores.length; i++) {
			if (Number(this.state.scores[i].id) === Number(id)) {
				content = this.state.scores[i];
				break;
			}
		}
	    this.setState({
			report: true,
			content: content,
			openedReport: e.target
	    });

	}

	handleReportCloseClick() {
		this.state.openedReport.style['background-color'] = 'var(--jd-yellow)';
		this.setState({
			report: false,
			openedReport: undefined
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
					<Report type="profile_report"
							close={this.handleReportCloseClick.bind(this)}
							lang={this.props.lang}
			                enddate={date}
			                mapname={this.state.content.level}
			                time={workingtime}
			                distance={this.state.content.distance}
			                fuel={this.state.content.gas_consumption}
			                logs={this.state.content.logs}
			                cost={this.state.content.m_score}
			                driving_unloaded_time={this.state.content.driving_unloaded_time}
			                loading={this.state.content.loading}
			                driving_loaded_time={this.state.content.driving_loaded_time}
			                unloading={this.state.content.unloading}
			                idling={this.state.content.idling}
			                driving_forward={this.state.content.driving_forward}
			                reverse={this.state.content.reverse}
			                driving_unloaded_distance={this.state.content.driving_unloaded_distance}
			                driving_loaded_distance={this.state.content.driving_loaded_distance}
			                fuel_cost={this.state.content.fuel_cost}
			                worker_salary={this.state.content.worker_salary}
			                loads_transported={this.state.content.loads_transported}
			                productivity={this.state.content.productivity}/>
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