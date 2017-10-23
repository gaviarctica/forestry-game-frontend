import React, { Component } from 'react';
import Button from './Button';
import LangSelection from './LangSelection';
import LoginSignupForm from './LoginSignupForm';
import './MainMenu.css';
import { FadeInFadeOut, TranslateDown, TranslateRight, TranslateLeft } from './animation';
import './animation.css';
import { login } from './api'

export default class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appearAnimation: false,
      centerElementAnimation: true,
      formMsg: undefined
    }
  }

  componentDidMount() {
    this.setState({
      appearAnimation: true
    });
  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');

    if (clicked === 'button-start-game') {
      this.props.switchView('mapmenu');
    }
  }

  handleFormClick(username, password) {
    // Set loggedIn for testing purposes
    // TODO: connect to backend
    this.setState({
      formMsg: undefined
    });
    var self = this;
    login(username, password, (message) => function() {
      if (message) {
        self.setState({
          formMsg: message
        });
      } else {
        self.setState({
          centerElementAnimation: false
        });

        setTimeout(function() {
          self.props.login(username);
          self.setState({
            centerElementAnimation: true
          });
        }, 350) // Exit animation duration
      }
    });   
  }

  render() {

    var langSelStyle = {
      position: 'fixed',
      right: '10%',
      top: '5%'
    }
    
    var leftButtonStyle = {
      position: 'fixed',
      left: '10%',
      bottom: '10%'
    }

    var rightButtonStyle = {
      position: 'fixed',
      right: '10%',
      bottom: '10%',
      backgroundColor: 'var(--jd-yellow)'
    }

    var centerElement;
    var startButtonText;
    if (this.props.loggedIn) {

      centerElement = (
        <div id="welcome-message">
          Welcome,<br />
          {this.props.username}
        </div>
      );

      startButtonText = 'Start game';

    } else {

      centerElement = <LoginSignupForm message={this.state.formMsg} handleClick={this.handleFormClick.bind(this)} />;
      startButtonText = 'Play as guest';
    }

    return (
      <div className="MainMenu">

        <TranslateLeft in={this.state.appearAnimation}>
          <LangSelection
            style={langSelStyle}
            lang={this.props.lang}
            changeLanguage={this.props.changeLanguage} />
        </TranslateLeft>

        <TranslateDown in={this.state.appearAnimation}>
          <FadeInFadeOut in={this.state.centerElementAnimation}>
          <TranslateDown in={this.state.centerElementAnimation}>
            {centerElement}
          </TranslateDown>
          </FadeInFadeOut>
        </TranslateDown>

        <TranslateRight in={this.state.appearAnimation}>
          <Button
            id="button-how-to-play"
            text="How to play"
            style={leftButtonStyle}
            handleClick={this.handleButtonClick.bind(this)} />
        </TranslateRight>

        <TranslateLeft in={this.state.appearAnimation}>
          <Button
            id="button-start-game"
            text={startButtonText}
            style={rightButtonStyle}
            handleClick={this.handleButtonClick.bind(this)} />
        </TranslateLeft>

      </div>
    );
  }
}
