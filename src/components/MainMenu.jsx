import React, { Component } from 'react';
import Button from './Button';
import LangSelection from './LangSelection';
import LoginSignupForm from './LoginSignupForm';
import MapMenu from './MapMenu';
import Profile from './Profile';
import Help from './Help'
import './MainMenu.css';
import { FadeInFadeOut, TranslateRight, TranslateLeft } from './animation';
import './animation.css';
import { API } from './api';
import { LANG } from './lang';
import { ic_videogame_asset, ic_account_box, ic_extension, ic_lightbulb_outline, ic_exit_to_app, ic_person_add, ic_settings } from 'react-icons-kit/md';

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
      profilePage: false,
      settingsOpen: false
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
    } else if (clicked === 'button-editor' && this.state.activeTab !== 'editor') {
      this.props.switchView('editorview');
    } else if (clicked === 'button-profile' && this.state.activeTab !== 'profile') {
      this.switchTab('profile');
    } else if (clicked === 'button-login' && this.state.activeTab !== 'login') {
      this.switchTab('login');
    } else if (clicked === 'button-help' && this.state.activeTab !== 'help') {
      this.switchTab('help');
    } else if (clicked === 'button-signup' && this.state.activeTab !== 'signup') {
      this.switchTab('signup');
    } else if (clicked === 'button-logout') {
      API.logout(function() {
        self.props.setLoggedOut();
      });
    } else if (clicked === 'button-settings') {
      this.setState(prevState => ({
        settingsOpen: !prevState.settingsOpen
      }));
    } else if (clicked === 'button-quality-low') {
      this.props.changeGraphicsSetting('low');
    } else if (clicked === 'button-quality-high') {
      this.props.changeGraphicsSetting('high');
    }
  }

  switchTab(newTab) {
    // display view exit animation
    this.setState({
      tabSwitchAnimation: false,
      activeTab: newTab,
      settingsOpen: false
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
    API.register(username, password, email, function(err, message, username, email) {
      if (err) throw err;
      // Registering was not successful
      if (err || message.length > 0) {
        self.setState({
          formMsg: message
        });
        self.props.notify(LANG[self.props.lang].mainMenu.loginSignupForm.messages[message[0]]);
      } else {
        self.handleFormSuccess(username, email);
      }
    });
  }

  handleLogin(username, password, email) {
    var self = this;
    API.login(username, password, function(err, message, un, em) {
      if (err) throw err;
      // Login was not successful
      if (message.length > 0) {
        self.setState({
          formMsg: message
        });
        self.props.notify(LANG[self.props.lang].mainMenu.loginSignupForm.messages[message[0]]);
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

  handleCheckboxChange(e) {
    const name = e.target.name;
    const checked = e.target.checked;
    this.setState({
      [name]: checked
    });
  }

  render() {
    var view;
    switch (this.state.activeView) {
      case 'play':
        view = (
          <MapMenu
            switchView={this.props.switchView}
            loggedIn={this.props.loggedIn}
            username={this.state.username}
            lang={this.props.lang}
            notify={this.props.notify} />
        );
        break;
      case 'profile':
        view = (
          <Profile
            username={this.props.username}
            email={this.props.email}
            lang={this.props.lang} />
        );
        break;

      case 'help':
        view = (
          <Help
            lang={this.props.lang} />
        );
        break;

      case 'login':
        view = (
          <LoginSignupForm
            message={this.state.formMsg}
            handleSubmit={this.handleFormSubmit.bind(this)}
            view='login'
            lang={this.props.lang} 
            notify={this.props.notify} />
        );
        break;

      case 'signup':
        view = (
          <LoginSignupForm
            message={this.state.formMsg}
            handleSubmit={this.handleFormSubmit.bind(this)}
            view='signup'
            lang={this.props.lang}
            notify={this.props.notify} />
        );
        break;

      default:
        view = 'You should never see this';
        break;
    }

    var tabs = {
      play     : <Button
                   id="button-play"
                   text={LANG[this.props.lang].navbar.play}
                   icon={ic_videogame_asset}
                   buttonType={this.state.activeTab === 'play' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      profile  : <Button
                   id="button-profile"
                   text={LANG[this.props.lang].navbar.profile}
                   icon={ic_account_box}
                   buttonType={this.state.activeTab === 'profile' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      editor   : <Button
                   id="button-editor"
                   text={LANG[this.props.lang].navbar.editor}
                   icon={ic_extension}
                   buttonType={this.state.activeTab === 'editor' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      help     : <Button
                   id="button-help"
                   text={LANG[this.props.lang].navbar.help}
                   icon={ic_lightbulb_outline}
                   buttonType={this.state.activeTab === 'help' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      logout   : <Button
                   id="button-logout"
                   text={LANG[this.props.lang].navbar.logOut}
                   icon={ic_exit_to_app}
                   buttonType='navbar-tab'
                   handleClick={this.handleButtonClick.bind(this)} />,
      login    : <Button
                   id="button-login"
                   text={LANG[this.props.lang].navbar.logIn}
                   icon={ic_exit_to_app}
                   buttonType={this.state.activeTab === 'login' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      signup   : <Button
                   id="button-signup"
                   text={LANG[this.props.lang].navbar.signUp}
                   icon={ic_person_add}
                   buttonType={this.state.activeTab === 'signup' ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />,
      settings : <Button
                   id="button-settings"
                   text={LANG[this.props.lang].navbar.settings}
                   icon={ic_settings}
                   buttonType={this.state.settingsOpen ? 'navbar-tab-active' : 'navbar-tab'}
                   handleClick={this.handleButtonClick.bind(this)} />
    }

    return (
      <div className="MainMenu">
        <div id="menu-background"></div>

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
              {tabs.help}
              {this.props.loggedIn ? tabs.logout : ''}
              {!this.props.loggedIn ? tabs.login : ''}
              {!this.props.loggedIn ? tabs.signup : ''}
              {tabs.settings}
            </div>
            </TranslateLeft>
        </div>

        {this.state.settingsOpen ?
          <div
            id="settings-menu" >
            <div className="settings-header">
              {LANG[this.props.lang].mainMenu.settings.language}
            </div>
            <LangSelection
                  lang={this.props.lang}
                  changeLanguage={this.props.changeLanguage} />
            <div className="settings-header">
              {LANG[this.props.lang].mainMenu.settings.graphics}
            </div>
            <div id="settings-graphics">
              <Button
                id="button-quality-low"
                buttonType={this.props.useLowQualityGraphics ? 'graphics-button-selected' : 'graphics-button'}
                text={LANG[this.props.lang].mainMenu.settings.low}
                handleClick={this.handleButtonClick.bind(this)} />
              <Button
                id="button-quality-high"
                buttonType={!this.props.useLowQualityGraphics ? 'graphics-button-selected' : 'graphics-button'}
                text={LANG[this.props.lang].mainMenu.settings.high}
                handleClick={this.handleButtonClick.bind(this)} />
            </div>
          </div>
        : ''}

        <FadeInFadeOut in={this.state.appearAnimation}>
          <FadeInFadeOut in={this.state.tabSwitchAnimation}>
            <div id="active-view-area">
              {view}
            </div>
          </FadeInFadeOut>
        </FadeInFadeOut>

      </div>
    );
  }
}
