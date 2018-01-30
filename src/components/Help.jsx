import React, { Component } from 'react';
import { LANG } from './lang';
import './Help.css';

export default class Help extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentCondImg: "static/gameplay.png",
			condInfo: "normalDescription",
			condValue: 1,
			currentEditorImg: "static/editor_roadtool.png",
			editorInfo: "roadtool",
			editorValue: 1
		};
	}

	handleEditorClick(e) {
		var id = e.target.value;
		var currentPic;
		var currentInfo;
		switch (id) {
			case "1":
				currentPic = "static/editor_roadtool.png";
				currentInfo = "roadtool";
				break;
			case "2":
				currentPic = "static/editor_logtool.png";
				currentInfo = "logstool";
				break;
			case "3":
				currentPic = "static/editor_deposittool.png";
				currentInfo = "deposittool";
				break;
			case "4":
				currentPic = "static/editor_trucktool.png";
				currentInfo = "trucktool";
				break;
			case "5":
				currentPic = "static/editor_removetool.png";
				currentInfo = "removetool";
				break;
			default:
				break;
		}

		this.setState({
			currentEditorImg: currentPic,
			editorInfo: currentInfo,
			editorValue: id
		});
	}

	handleConditionClick(e) {
		var id = e.target.value;
		var currentPic;
		var currentInfo;
		switch (id) {
			case "1":
				currentPic = "static/gameplay.png";
				currentInfo = "normalDescription";
				break;
			case "2":
				currentPic = "static/gp1.png";
				currentInfo = "dyingDescription";
				break;
			case "3":
				currentPic = "static/gp2.png";
				currentInfo = "weightDescription";
				break;
			case "4":
				currentPic = "static/gp3.png";
				currentInfo = "onewayDescription";
				break;
			case "5":
				currentPic = "static/gp4.png";
				currentInfo = "fogDescription";
				break;
			default:
				break;
		}

		this.setState({
			currentCondImg: currentPic,
			condInfo: currentInfo,
			condValue: id
		});
	}

	render() {

		var tool = LANG[this.props.lang].help.editor[this.state.editorInfo];
		var info = LANG[this.props.lang].help.gameplay[this.state.condInfo];
		return (
			<div className="Help">
				<div className="help-content">
					<div className="h1">
						<span id="help-content-gameplay-title">{LANG[this.props.lang].help.gameplay.gameplay}</span>						
					</div>
					<p>
						{LANG[this.props.lang].help.gameplay.gameplayintro}
					</p>
					<p>
						{LANG[this.props.lang].help.gameplay.gameplaydescription}
					</p>

					<div className="h2">
						<span>{LANG[this.props.lang].help.gameplay.conditions}</span><br/>
					</div>

					<p>
						{LANG[this.props.lang].help.gameplay.conditionsDescription}
					</p>

					<select name="menu-conditions" className="menu" onChange={this.handleConditionClick.bind(this)} value={this.state.condValue}>
						<option value={1}>{LANG[this.props.lang].help.gameplay.normalMenu}</option>
						<option value={2}>{LANG[this.props.lang].help.gameplay.limitedcrossingMenu}</option>
						<option value={3}>{LANG[this.props.lang].help.gameplay.weightlimitMenu}</option>
						<option value={4}>{LANG[this.props.lang].help.gameplay.onewayMenu}</option>
						<option value={5}>{LANG[this.props.lang].help.gameplay.fogMenu}</option>
					</select>

					<div className="road-conditions">
						<p>
							{info}
						</p>
						<img alt="condition" src={this.state.currentCondImg}/>
					</div>

					<div className="h2">
						<span>{LANG[this.props.lang].help.controls.controls}</span><br/>
					</div>
					<div id="controls">
						<img alt="controls" src="static/controls.png"/>
						<p>
							{LANG[this.props.lang].help.controls.controls1}<br/>
							{LANG[this.props.lang].help.controls.controls2}<br/>
							{LANG[this.props.lang].help.controls.controls3}<br/>
							{LANG[this.props.lang].help.controls.controls4}<br/>
							{LANG[this.props.lang].help.controls.controls5}<br/>
							{LANG[this.props.lang].help.controls.controls6}<br/>
							{LANG[this.props.lang].help.controls.controls7}<br/>
						</p>
					</div>
					
					<hr className="primary-hr"></hr>

					<div className="h1">
						<span id="help-content-editor-title">{LANG[this.props.lang].help.editor.editor}</span>
					</div>

					<select name="menu-editor" className="menu" onChange={this.handleEditorClick.bind(this)} value={this.state.editorValue}>
						<option value={1}>{LANG[this.props.lang].help.editor.roadtoolMenu}</option>
						<option value={2}>{LANG[this.props.lang].help.editor.logstoolMenu}</option>
						<option value={3}>{LANG[this.props.lang].help.editor.deposittoolMenu}</option>
						<option value={4}>{LANG[this.props.lang].help.editor.trucktoolMenu}</option>
						<option value={5}>{LANG[this.props.lang].help.editor.removetoolMenu}</option>
					</select>
					<p>
						{tool}
					</p>
					<img alt="editor-tool" src={this.state.currentEditorImg}/>
					<hr className="primary-hr"></hr>
				</div>
				<div className="help-license">
					<div className="h1">
						<span id="help-license-title">{LANG[this.props.lang].help.licenses.licenses}</span>
					</div>
				</div>
			</div>
		);
	}
}