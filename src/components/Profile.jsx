import React, { Component } from 'react';
import Button from './Button';
import './Profile.css';
import Report from './Report';
import { API } from './api';
import { LANG } from './lang';
import Icon from 'react-icons-kit';
import { user } from 'react-icons-kit/icomoon/user';
import { mail } from 'react-icons-kit/icomoon/mail';
import { secondsToDateFormat } from '../game/helpers';
import { TranslateLeftReport, TranslateRightReport, TranslateLeftProfile, TranslateRightProfile } from './animation';

function filterByMap() {
	var input, filter, table, tr;
	input = document.getElementById("map-search");
	filter = input.value.toUpperCase();
	table = document.getElementById("profile-score-info");
	tr = table.getElementsByTagName("tr");

	for (var i = 0; i < tr.length; i++) {
		var td = tr[i].getElementsByTagName("td")[2];
		if (td) {
			if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}

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

	var selectedButtonStyle = {
		height: '30px',
		lineHeight: '30px',
		width: '100%',
		fontSize: '1em',
		boxShadow: 'var(--menu-shadow-2)',
		borderRadius: '5px',
		backgroundColor: 'var(--jd-green)'
	}


	for (let i = 0; i < props.data.length; i++) {
		var date = new Date(props.data[i].timestamp);
		var d = date.getDate();
		var m = date.getMonth()+1;
		var y = date.getFullYear();
		var hh = date.getHours();
		var mm = date.getMinutes();

		rows.push(<tr key={props.data[i].id}>
					<td>{hh}:{mm<10?'0':''}{mm}<br/>{d}.{m}.{y}</td>
				    <td>{props.data[i].m_score} €</td>
				    <td>{props.data[i].level}</td>
				    <td>
				    	<Button
				    		text={LANG[props.lang].buttons.report}
				    		id={props.data[i].id}
				    		style={parseInt(props.openedReport) === props.data[i].id ? selectedButtonStyle : tableButtonStyle}
				    		handleClick={props.handleButtonClick}/>
				    </td>
				  </tr>);
	}
	
	return (<div>
			<input type="text" id="map-search" onKeyUp={filterByMap} placeholder={LANG[props.lang].mainMenu.profileTab.search} />
			<div id="profile-table-wrapper">
				<table id="profile-score-info">
				  <thead>
				  	<tr>
				  		<th>{LANG[props.lang].mainMenu.profileTab.timestamp}</th>
					    <th>{LANG[props.lang].mainMenu.profileTab.cost}</th>
					    <th>{LANG[props.lang].mainMenu.profileTab.map}</th>
					    <th style={{"width": "100px"}}>{LANG[props.lang].mainMenu.profileTab.info}</th>
					</tr>
				  </thead>
				  <tbody>
				  	{rows}
				  </tbody>
				</table>
			</div>
	</div>);
}

function getRightContentData(t) {
	if (t.state.report) {
		return (
			<Report type="profile_report"
						close={t.handleReportCloseClick.bind(t)}
						lang={t.props.lang}
		                enddate={new Date(t.state.content.timestamp)}
		                mapname={t.state.content.level}
		                time={secondsToDateFormat(t.state.content.duration)}
		                distance={t.state.content.distance}
		                fuel={t.state.content.gas_consumption}
		                logs={t.state.content.logs}
		                cost={t.state.content.m_score}
		                driving_unloaded_time={secondsToDateFormat(t.state.content.driving_unloaded_time)}
		                driving_loaded_time={secondsToDateFormat(t.state.content.driving_loaded_time)}
		                loading_and_unloading={secondsToDateFormat(t.state.content.loading_and_unloading)}
		                idling={secondsToDateFormat(t.state.content.idling)}
		                driving_forward={t.state.content.driving_forward}
		                reverse={t.state.content.reverse}
		                driving_unloaded_distance={t.state.content.driving_unloaded_distance}
		                driving_loaded_distance={t.state.content.driving_loaded_distance}
		                fuel_cost={t.state.content.fuel_cost}
		                worker_salary={t.state.content.worker_salary}
		                loads_transported={t.state.content.loads_transported}
		                logs_deposited={t.state.content.logs_deposited}
		                total_volume={t.state.content.total_volume}
		                productivity={t.state.content.productivity}/>
		);
	} else {
		return '';
	}
}

export default class Profile extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	scores: undefined,
			report: undefined,
			openedReportId: undefined,
			appearAnimation: false,
			closing: false
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
			content: content,
			openedReportId: id,
			appearAnimation: true,
			closing: false
	    });
	    var self = this;
	    setTimeout(function() {
          self.setState({
            appearAnimation: false,
            closing: true
          });
        }, 350);
        
	}

	handleReportCloseClick() {
		this.setState({
			appearAnimation: true
	    });
	    var self = this;
	    setTimeout(function() {
          self.setState({
          	report: false,
			openedReportId: undefined,
            appearAnimation: false,
            closing: false
          });
        }, 350);
	}

	render() {

		var leftContent;
		var rightContent;
		var rc;
		var lc;
		var rows;
		if (this.state.scores) {
			rows = (<Rows
					  	data={this.state.scores}
					  	handleButtonClick={this.handleButtonClick.bind(this)}
						lang={this.props.lang}
						openedReport = {this.state.openedReportId ? this.state.openedReportId : undefined}/>
			);
		} else {
			rows = (<p id="profile-no-scores">
						{LANG[this.props.lang].mainMenu.profileTab.noScoresFound}
					</p>
			);
		}

		lc = (<div id="left-content">
						<div id="profile-header">
							{LANG[this.props.lang].mainMenu.profileTab.profile}
						</div>
						<div id="user-info">
							<div id="user-info-username">
								<Icon size={16} icon={user} id="user-info-username-icon"/>
								<span id="user-info-username-header">{this.props.username}</span>
							</div>
							<div id="user-info-email">
								<Icon size={16} icon={mail} id="user-info-email-icon" />
								<span id="user-info-email-paragraph">{this.props.email}</span>
							</div>
						</div>
						<hr></hr>
						
						<div id="profile-content">
							{rows}
						</div>
					</div>
		);

		rc = (
			<div id="right-content">
				{
	              this.state.report ? (
	                getRightContentData(this)
	              ) : ('')
				}
			</div>
		);

		if (!this.state.closing) {
			rightContent = (

				<TranslateRightReport in={this.state.appearAnimation}>
					{rc}
				</TranslateRightReport>
	    	);

	    	leftContent = (
				<TranslateLeftProfile in={this.state.appearAnimation}>
					{lc}
				</TranslateLeftProfile>
			);
		} else {
			rightContent = (

				<TranslateLeftReport in={this.state.appearAnimation}>
					{rc}
				</TranslateLeftReport>
	    	);

	    	leftContent = (
				<TranslateRightProfile in={this.state.appearAnimation}>
					{lc}
				</TranslateRightProfile>
			);
		}

		return (
			<div className="Profile">
				{leftContent}
				{rightContent}
			</div>
		);
	}
}