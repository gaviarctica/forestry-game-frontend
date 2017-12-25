import React, { Component } from 'react';
import './Game.css';
import Button from './Button';
import GameStat from './GameStat';
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
      logsRemainingOnGround: {
        '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0
      },
      hideLogType: {
        '0': false, '1': false, '2': false, '3': false, '4': false, '5': false
      },
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

    if (clicked === 'button-quit' || clicked === 'game-end-button-quit') {
      this.gameCanvas.destroy();
      this.props.switchView('mainmenu');
    }
  }

  handleLogsRemainingClick(type) {
    let hidden = this.state.hideLogType;
    hidden[type] = !hidden[type];
    this.setState({
      hideLogType: hidden
    });

    // TODO: Get this info to the game canvas and hide/unhide affected logs
    if (hidden[type]) {
      console.log('type ' + type + ' hidden!');
    } else {
      console.log('type ' + type + ' unhidden!');
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
    var quitButtonStyle = {
      
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
                id="game-end-button-quit"
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
        <Button 
          id="button-quit"
          text={LANG[this.props.lang].buttons.quit}
          buttonType='default'
          style={quitButtonStyle}
          handleClick={this.handleButtonClick.bind(this)} />
        <div id="game-info">
          <GameStat
            header={LANG[this.props.lang].game.time}
            value={this.state.timestring} />
          <GameStat
            header={LANG[this.props.lang].game.distance}
            value={this.state.distance + ' m'} />
          <GameStat
            header={LANG[this.props.lang].game.fuelConsumed}
            value={this.state.fuel + ' l'} />
          <GameStat
            header={LANG[this.props.lang].game.cost}
            value={this.state.cost + ' €'} />
          <GameStat
            header={LANG[this.props.lang].game.logsRemaining}
            content={
              <div id="logs-remaining">
                {Object.keys(this.state.logsRemainingOnGround).map(key => {
                  return (
                    <div
                      key={key}
                      className={'logs-remaining-count log-type-' + key + (this.state.logsRemainingOnGround[key] === 0 || this.state.hideLogType[key] ? ' disabled' : '')}
                      onClick={() => this.handleLogsRemainingClick(key)} >
                      {this.state.logsRemainingOnGround[key]}
                    </div>
                  );
                })}
              </div>
            } />          
        </div>
        <div id="log-load-container">
          <div id="log-load">
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[0][0]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[1][0]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][0]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[3][0]}></div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[0][1]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[1][1]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][1]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[3][1]}></div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[0][2]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[1][2]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][2]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[3][2]}></div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[1][3]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][3]}></div>
            </div>
            <div className="log-load-row">
              <div className={'log-load-fill log-type-' + this.state.logs[1][4]}></div>
              <div className={'log-load-fill log-type-' + this.state.logs[2][4]}></div>
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
