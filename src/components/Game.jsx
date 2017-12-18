import React, { Component } from 'react';
import './Game.css';
import Button from './Button';
import Report from './Report';
import GameCanvas from '../game/game';
import Loader from './Loader';
import { API } from './api';
import { LANG } from './lang';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestring: '00:00:00',
      time: 0,
      distance: 0,
      cost: 0,
      fuel: 0,
      logs: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      gameEnd: false,
      gameEndDate: undefined,
      mapdata: undefined,
      mapname: undefined,
      mapID: undefined,
      loadingContent: true
    }
  }

  updateUI(update) {
    if (!this.state.gameEnd) {
      this.setState(update);
    }
    if (update.gameEnd && !this.state.gameEndDate) {
      var d = new Date();
      this.setState({
        gameEndDate: d.toISOString()
      });
      API.postReport({
        distance: this.state.distance,
        time: this.state.time,
        fuel: this.state.fuel,
        logs: JSON.stringify(this.parseLogs(this.state.mapdata.logs)),
        enddate: this.state.gameEndDate,
        id: this.state.mapID
      }, function(err) {
        if (err) throw err;
      })
    }
  }

  componentDidMount() {
    var self = this;
    API.getMapData(this.props.viewData.mapID, function(err, responseJson) {
      if (err) throw err;

      if (responseJson.length > 0) {
        self.gameCanvas = new GameCanvas(responseJson[0].mapdata, self.updateUI.bind(self));
        self.setState({
          mapdata: responseJson[0].mapdata,
          mapname: responseJson[0].name,
          mapID: responseJson[0].id
        });
      }
    });
    setTimeout(function() {
      self.setState({
        loadingContent: false
      });
    }, 700);
  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');

    if (clicked === 'button-quit') {
      this.gameCanvas.destroy();
      this.props.switchView('mainmenu');
    }
  }

  parseLogs(logs) {
    var logsParsed = {};

    for (var i = 0; i < logs.length; i++) {
      if (logsParsed.hasOwnProperty(logs[i].type)) {
        logsParsed[logs[i].type] += 1;
      } else {
        logsParsed[logs[i].type] = 1;
      }
    }
    return logsParsed;
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
        {
          this.state.loadingContent ? (
            <Loader />
          ) : ('')
        }
        <div id="canvas-game"></div>
        {this.state.gameEnd == true &&
        <div id="game-end">
          <div id="game-end-container">
            <div id="game-end-menu">
              <h1>{LANG[this.props.lang].game.levelFinished}</h1>
              <Button 
                id="button-quit"
                text={LANG[this.props.lang].buttons.quit}
                buttonType='default'
                style={quitButtonStyle}
                handleClick={this.handleButtonClick.bind(this)} />
            </div>
            <div id="game-end-report">
              <Report
                type="endgame_report"
                lang={this.props.lang}
                enddate={this.state.gameEndDate}
                mapname={this.state.mapname}
                time={this.state.timestring}
                duration={this.state.time}
                distance={this.state.distance}
                fuel={this.state.fuel}
                cost={this.state.cost}
                logs={this.parseLogs(this.state.mapdata.logs)} />
            </div>
          </div>
        </div>
        }
        <div id="game-info">
          <Button 
                id="button-quit"
                text={LANG[this.props.lang].buttons.quit}
                buttonType='default'
                style={quitButtonStyle}
                handleClick={this.handleButtonClick.bind(this)} />
          <div id="game-stats">
            <div id="game-stats-grouped">
              <div id="user">{this.props.username}</div>
              <div id="time">{this.state.timestring}</div>
              <div id="distance">{this.state.distance} m</div>
              <div id="fuel">{this.state.fuel} l</div>
              <div id="unload-count">{this.state.cost} Euros</div>
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
