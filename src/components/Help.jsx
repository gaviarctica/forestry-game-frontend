import React, { Component } from 'react';
import './Help.css';

export default class Help extends Component {

	render() {
		return (
			<div className="Help">
				<div className="help-content">
					<div id="help-content-gameplay">
						<span id="help-content-gameplay-title">Gameplay</span>
						<p>
							Goal of the game is to load all logs in the working area and
							unload them into unloading stations. A game is completed when
							all the logs are unloaded to their respective unloading stations.
						</p>
						<span className="h2">Controls</span><br/>
						<p>
							- Use arrow- or WASD- keys to move the truck.<br/>
							- Pick up the logs using space or mouse left-click.<br/>
							- Move the camera with mouse right-click or mouse middle-button.<br/>
							- Choose a log or unloading station with buttons Q and E.<br/>
							- Numpad keys 1-9 can be used to show/hide available logs.<br/>

						</p>
					</div>
					<div id="help-content-editor">
						<span id="help-content-editor-title">Editor</span>
						<p>
							In editor you can create new custom maps.
						</p>
						<span className="h2">Tools</span><br/>
						<p>
							- Roadtool<br/>
							- Logstool<br/>
							- Deposittool<br/>
							- Trucktool<br/>
						</p>
					</div>
				</div>
				<div className="help-license">
					<span id="help-license-title">Licenses</span>
				</div>
			</div>
		);
	}
}