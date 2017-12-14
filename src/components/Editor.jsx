import React, { Component } from 'react';
import './Editor.css';
import Button from './Button';
import EditorCanvas from '../editor/editor';
import { API } from './api';
import { LANG } from './lang';

export default class Editor extends Component {
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
    self.editorCanvas = new EditorCanvas(self.updateUI.bind(self));
  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');

    if (clicked === 'button-quit') {
      this.editorCanvas.destroy();
      this.props.switchView('mainmenu');
    }
    if (clicked === 'button-road') {
      this.editorCanvas.selectTool('road');
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
      <div className="Editor">
        <div id="canvas-editor"></div>
        <div id="game-info">
        <Button 
          id="button-quit"
          text={LANG[this.props.lang].buttons.quit}
          buttonType='default'
          style={quitButtonStyle}
          handleClick={this.handleButtonClick.bind(this)} />
        <Button 
          id="button-road"
          text={LANG[this.props.lang].buttons.road}
          buttonType='default'
          style={quitButtonStyle}
          handleClick={this.handleButtonClick.bind(this)} />
        <Button 
          id="button-logs"
          text={LANG[this.props.lang].buttons.logs}
          buttonType='default'
          style={quitButtonStyle}
          handleClick={this.handleButtonClick.bind(this)} />
        </div>
        
      </div>
    );
  }
}
