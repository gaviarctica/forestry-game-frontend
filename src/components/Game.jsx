import React, { Component } from 'react';
import './Game.css';
import Button from './Button';
import GameCanvas from '../game/game';
import { API } from './api';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      distance: 0,
      score: 0,
      fuel: 0,
      logs: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      gameEnd: false
    }
  }

  updateUI(update) {
    this.setState(update);
  }

  componentDidMount() {
    var self = this;
    API.getMapData(this.props.viewData.mapID, function(err, responseJson) {
      if (err) throw err;

      if (responseJson.length > 0) {
        self.gameCanvas = new GameCanvas(responseJson[0].mapdata, self.updateUI.bind(self));
      }
    });
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
        {this.state.gameEnd == true &&
        <div id="game-end">
          Game is over!
          Maybe show some report and buttons here
        </div>
        }
        <div id="game-info">
          <Button 
                id="button-quit"
                text="Quit"
                buttonType='default'
                style={quitButtonStyle}
                handleClick={this.handleButtonClick.bind(this)} />
          <div id="game-stats">
            <div id="game-stats-grouped">
              <div id="user">{this.props.username}</div>
              <div id="time">{this.state.time}</div>
              <div id="distance">{this.state.distance} m</div>
              <div id="fuel">{this.state.fuel} l</div>
              <div id="unload-count">{this.state.score} pts</div>
              <Button 
                id="button-show-report"
                text="Show report"
                buttonType='primary'
                style={buttonStyle} />
            </div>
          </div>

          <div id="logs-remaining">
            <div id="logs-remaining-row">
              <div className="logs-remaining-count">1</div>
              <div className="logs-remaining-count">2</div>
              <div className="logs-remaining-count">3</div>
              <div className="logs-remaining-count">4</div>
            </div>
          </div>

          <div id="log-load">
          <div className="log-load-row">
            <div className={'log-load-fill log-type-' + this.state.logs[0][0]}>{this.state.logs[0][0]}</div>
            <div className={'log-load-fill log-type-' + this.state.logs[1][0]}>{this.state.logs[1][0]}</div>
            <div className={'log-load-fill log-type-' + this.state.logs[2][0]}>{this.state.logs[2][0]}</div>
            <div className={'log-load-fill log-type-' + this.state.logs[3][0]}>{this.state.logs[3][0]}</div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[0][1]}>{this.state.logs[0][1]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[1][1]}>{this.state.logs[1][1]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][1]}>{this.state.logs[2][1]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[3][1]}>{this.state.logs[3][1]}</div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[0][2]}>{this.state.logs[0][2]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[1][2]}>{this.state.logs[1][2]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][2]}>{this.state.logs[2][2]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[3][2]}>{this.state.logs[3][2]}</div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[1][3]}>{this.state.logs[1][3]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][3]}>{this.state.logs[2][3]}</div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[1][4]}>{this.state.logs[1][4]}</div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][4]}>{this.state.logs[2][4]}</div>
            </div>
            <div className="log-load-border log-load-border-notch" id="log-load-border-notch-1"></div>
            <div className="log-load-border log-load-border-notch" id="log-load-border-notch-2"></div>
            <div className="log-load-border" id="log-load-border-1"></div>
            <div className="log-load-border" id="log-load-border-2"></div>
            <div className="log-load-border" id="log-load-border-3"></div>
            <div className="log-load-border" id="log-load-border-4"></div>
            <div className="log-load-border" id="log-load-border-5"></div>
            <div className="log-load-border" id="log-load-border-6"></div>
            <div className="log-load-border" id="log-load-border-7"></div>
          </div>
        </div>
      </div>
    );
  }
}
