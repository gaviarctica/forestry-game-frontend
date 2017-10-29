import React, { Component } from 'react';
import Button from './Button';
import LangSelection from './LangSelection';
import LoginSignupForm from './LoginSignupForm';
import MapMenu from './MapMenu';
import Profile from './Profile';
import './MainMenu.css';
import { FadeInFadeOut, TranslateDown, TranslateRight, TranslateLeft } from './animation';
import './animation.css';
import { API } from './api';
import { ic_videogame_asset, ic_account_box, ic_extension, ic_lightbulb_outline, ic_exit_to_app, ic_person_add } from 'react-icons-kit/md';

export default class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appearAnimation: false,
      centerElementAnimation: true,
      tabSwitchAnimation: true,
      formMsg: undefined,
      activeTab: 'play',
      activeView: 'play',
      profilePage: false
    }
  }

  componentDidMount() {
    this.setState({
      appearAnimation: true
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn !== this.props.loggedIn) {
      this.switchTab('play');
    }
  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');
    var self = this;

    if (clicked === 'button-play' && this.state.activeTab !== 'play') {
      this.switchTab('play');
    } else if (clicked === 'button-profile' && this.state.activeTab !== 'profile') {
      this.switchTab('profile');
    } else if (clicked === 'button-login' && this.state.activeTab !== 'login') {
      this.switchTab('login');
    } else if (clicked === 'button-signup' && this.state.activeTab !== 'signup') {
      this.switchTab('signup');
    } else if (clicked === 'button-logout') {
      API.logout(function() {
        self.props.setLoggedOut();
      });
    } 
  }

  switchTab(newTab) {
    // display view exit animation
    this.setState({
      tabSwitchAnimation: false,
      activeTab: newTab
    });

    // After exit animation, switch view and start new view enter animation
    var self = this;
    setTimeout(function() {
      self.setState({
        activeView: newTab,
        tabSwitchAnimation: true,
        formMsg: undefined
      });
    }, 350); // Duration of fade out animation    
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
    var view;
    switch (this.state.activeView) {
      case 'play':
        view = (
          <MapMenu
            switchView={this.props.switchView}
            loggedIn={this.state.loggedIn}
            username={this.state.username}
            lang={this.state.lang} />
        );
        break;

      case 'profile':
        view = (
          <Profile
            username={this.props.username}
            email={this.props.email} />
        );
        break;

      case 'login':
        view = (
          <LoginSignupForm
            message={this.state.formMsg}
            handleSubmit={this.handleFormSubmit.bind(this)}
            view='login' />
        );
        break;

      case 'signup':
        view = (
          <LoginSignupForm
            message={this.state.formMsg}
            handleSubmit={this.handleFormSubmit.bind(this)}
            view='signup' />
        );
        break;

      default:
        view = 'You should never see this';
        break;
    }

    var tabs = {
      play     : <Button
                   id="button-play"
                   text="Play"
                   icon={ic_videogame_asset}
                   buttonType={this.state.activeTab === 'play' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      profile  : <Button
                   id="button-profile"
                   text="Profile"
                   icon={ic_account_box}
                   buttonType={this.state.activeTab === 'profile' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      editor   : <Button
                   id="button-editor"
                   text="Editor"
                   icon={ic_extension}
                   buttonType={this.state.activeTab === 'editor' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      tutorial : <Button
                   id="button-tutorial"
                   text="Tutorial"
                   icon={ic_lightbulb_outline}
                   buttonType={this.state.activeTab === 'tutorial' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      logout   : <Button
                   id="button-logout"
                   text="Log out"
                   icon={ic_exit_to_app}
                   buttonType='navbar-tab'
                   handleClick={this.handleButtonClick.bind(this)} />,
      login    : <Button
                   id="button-login"
                   text="Log in"
                   icon={ic_exit_to_app}
                   buttonType={this.state.activeTab === 'login' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      signup   : <Button
                   id="button-signup"
                   text="Sign up"
                   icon={ic_person_add}
                   buttonType={this.state.activeTab === 'signup' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />
    }

    return (
      <div className="MainMenu">

        <div id="navbar">          
            <TranslateRight in={this.state.appearAnimation}>
            <div id="navbar-left">
              {tabs.play}
              {this.props.loggedIn ? tabs.profile : ''}
              {this.props.loggedIn ? tabs.editor : ''}
            </div>
            </TranslateRight>          
            <TranslateLeft in={this.state.appearAnimation}>
            <div id="navbar-right">
              {tabs.tutorial}
              {this.props.loggedIn ? tabs.logout : ''}
              {!this.props.loggedIn ? tabs.login : ''}
              {!this.props.loggedIn ? tabs.signup : ''}
              <LangSelection
                lang={this.props.lang}
                changeLanguage={this.props.changeLanguage} />
            </div>
            </TranslateLeft>
        </div>

          <FadeInFadeOut in={this.state.tabSwitchAnimation}>
            <div id="active-view-area">
              {view}
            </div>            
          </FadeInFadeOut>

      </div>
    );
  }
}
