import React, { Component } from 'react';
import Button from './Button';
import LangSelection from './LangSelection';
import LoginSignupForm from './LoginSignupForm';
import Profile from './Profile';
import './MainMenu.css';
import { FadeInFadeOut, TranslateDown, TranslateRight, TranslateLeft } from './animation';
import './animation.css';
import { API } from './api';

export default class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appearAnimation: false,
      centerElementAnimation: true,
      formMsg: undefined,
      profilePage: false
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
    } else if (clicked === 'button-logout') {
      API.logout(function() {
        console.log("Log out");
      });
    } else if (clicked === 'button-profile') {
      this.setState({
        centerElementAnimation: false
      });

      var self = this;
      setTimeout(function() {
        self.setState({
          centerElementAnimation: true,
          profilePage: true
        });
      }, 350);
    }
  }

  handleFormSuccess(username, email) {
    this.setState({
      centerElementAnimation: false
    });
    var self = this;
    setTimeout(function() {
      self.props.setLoggedIn(username, email);
      self.setState({
        centerElementAnimation: true
      });
      console.log(self.props);
    }, 350) // Exit animation duration
  }

  handleRegister(username, password, email) {
    var self = this;
    API.register(username, password, email, function(err, message, un, em) {
      if (err) throw err;

      // Registering was not successful
      if (message) {
        self.setState({
          formMsg: message
        });
      } else {
        self.handleFormSuccess(un, em);
      }
    });
  }

  handleLogin(username, password, email) {
    var self = this;
    API.login(username, password, function(err, message, un, em) {
      if (err) throw err;
      // Login was not successful
      if (message) {
        self.setState({
          formMsg: message
        });
      } else {
        self.handleFormSuccess(un, em);
      }
    });
  }

  handleFormSubmit(formId, username, password, email) {
    this.setState({
      formMsg: undefined
    });

    if (formId === 'signup-form') {
      this.handleRegister(username, password, email);
    } else if (formId === 'login-form') {
      this.handleLogin(username, password, email);
    }  
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
      if (this.state.profilePage) {
        centerElement = (
          <Profile
            username={this.props.username}
            email={this.props.email}
          />
        );
      } else {
        centerElement = (
          <div id="welcome-message">
            Welcome,<br />
            {this.props.username}
          </div>
        );
      }
      startButtonText = 'Start game';

    } else {

      centerElement = <LoginSignupForm
                        message={this.state.formMsg}
                        handleSubmit={this.handleFormSubmit.bind(this)} />;
      startButtonText = 'Play as guest';
    }

    return (
      <div className="MainMenu">

        <div className="header">
          <TranslateRight in={this.state.appearAnimation}>
            <Button
              id="button-profile"
              text="Profile"
              handleClick={this.handleButtonClick.bind(this)} />
          </TranslateRight>
        </div>

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

        <TranslateLeft in={this.state.appearAnimation}>
        <Button
            id="button-logout"
            text="Log out"
            handleClick={this.handleButtonClick.bind(this)} />
        </TranslateLeft>

      </div>
    );
  }
}
