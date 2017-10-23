import React, { Component } from 'react';
import './Game.css';
import Button from './Button';
import GameCanvas from '../game/game';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      distance: 0,
      score: 0
    }
  }

  updateTime(time) {
    this.setState({
      time: time
    });
  }

  updateDistance(distance) {
    this.setState({
      distance: distance
    });
  }

  updateScore(score) {
    this.setState({
      score: score
    })
  }

  componentDidMount() {
    this.gameCanvas = new GameCanvas(this.updateTime.bind(this), this.updateDistance.bind(this), this.updateScore.bind(this));
  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');

    if (clicked === 'button-quit') {
      this.gameCanvas.destroy();
      this.props.switchView('mainmenu');
    }
  }

  render() {
    var buttonStyle = {
      backgroundColor: 'var(--jd-yellow)',
      width: '100%'
    };
    var quitButtonStyle = {
      width: '180px',
      height: '40px',
      lineHeight: '40px'
    };
    return (
      <div className="Game">
        <div id="canvas-game"></div>
        <div id="game-info">
          <Button 
                id="button-quit"
                text="Quit" 
                style={quitButtonStyle}
                handleClick={this.handleButtonClick.bind(this)} />
          <div id="game-stats">
            <div id="game-stats-grouped">
              <div id="user">{this.props.username}</div>
              <div id="time">{this.state.time}</div>
              <div id="distance">{this.state.distance}m</div>
              <div id="unload-count">{this.state.score}</div>
              <Button 
                id="button-show-report"
                text="Show report"
                style={buttonStyle} />
            </div>
          </div>

          <div id="logs-remaining">
            <div id="logs-remaining-row">
              <div id="logs-remaining-count">1</div>
              <div id="logs-remaining-count">2</div>
              <div id="logs-remaining-count">3</div>
              <div id="logs-remaining-count">4</div>
            </div>
          </div>

          <div id="log-load">
            <div id="log-load-row">
              <div id="log-load-fill">1</div>
              <div id="log-load-fill">2</div>
              <div id="log-load-fill">3</div>
              <div id="log-load-fill">4</div>
            </div>
            <div id="log-load-row">
              <div id="log-load-fill">1</div>
              <div id="log-load-fill">2</div>
              <div id="log-load-fill">3</div>
              <div id="log-load-fill">4</div>
            </div>
            <div id="log-load-row">
              <div id="log-load-fill">1</div>
              <div id="log-load-fill">2</div>
              <div id="log-load-fill">3</div>
              <div id="log-load-fill">4</div>
            </div>
            <div id="log-load-row">
              <div id="log-load-fill">1</div>
              <div id="log-load-fill">2</div>
              <div id="log-load-fill">3</div>
              <div id="log-load-fill">4</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
