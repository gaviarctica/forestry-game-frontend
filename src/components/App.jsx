import React, { Component } from 'react';
import './App.css';
import MainMenu from './MainMenu';
import Game from './Game';
import Editor from './Editor';
import { FadeInFadeOut } from './animation';
import './animation.css';
import { API } from './api';
import NotificationBox from './NotificationBox'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.timer;
    this.state = {
      currentView: '',
      viewData: undefined,
      loggedIn: false,
      username: '',
      email: '',
      lang: 'en',
      viewAnimation: false,
      validationDone: false,
      notification: "",
      useLowQualityGraphics: false
    }
  }

  componentWillMount() {
    // Get browser language
    var userLang = navigator.language || navigator.userLanguage;
    if (userLang === 'fi-FI') {
      this.setState({
        lang: 'fi'
      });
    }

    // Get CSRF token from Django for forms
    // and validate sessionid if it exists
    var self = this;
    API.validateSession(function(err, username, email) {
      if (err) {
        self.setState({
          loggedIn: false,
          currentView: 'mainmenu'
        });
        throw err;
      }
      if (username) {
        self.setState({
          loggedIn: true,
          username: username,
          email: email,
          validationDone: true,
          currentView: 'mainmenu'
        });
      } else {
        self.setState({
          loggedIn: false,
          validationDone: true,
          currentView: 'mainmenu'
        });
      }
    });    
  }

  componentWillUpdate() {
    clearTimeout(this.timer);
  }

  componentDidMount() {
    // Display first view enter animation
    this.setState({
      viewAnimation: true
    });
  }

  hideNotificationBox() {
    this.setState({
      notification: ''
    });
  }

  changeLanguage(newLanguage) {
    this.setState({
      lang: newLanguage
    });
  }

  setLoggedIn(username, email) {
    this.setState({
      loggedIn: true,
      username: username,
      email: email
    });
  }

  setLoggedOut() {
    this.setState({
      loggedIn: false,
      username: '',
      email: ''
    });
  }

  switchView(newView, data) {
    // display view exit animation
    this.setState({
      viewAnimation: false
    });

    // After exit animation, switch view and start new view enter animation
    var self = this;
    setTimeout(function() {
      self.setState({
        currentView: newView,
        viewData: data,
        viewAnimation: true
      });
    }, 350); // Duration of fade out animation
       
  }

  // Displays a notification message on top left corner
  // Pass this in props as notify. Use by giving the function
  // a message as a parameter
  notify(message) {
    this.setState({
      notification: message
    })

    this.timer = setTimeout(() => {
      this.setState({
        notification: ""
      })
    }, 4000)
  }

  changeGraphicsSetting(setting) {
    if (setting === 'low') {
      this.setState({
        useLowQualityGraphics: true
      })
    } else if (setting === 'high') {
      this.setState({
        useLowQualityGraphics: false
      })
    }
  }

  render() {
    var view;
    switch(this.state.currentView) {
      case 'mainmenu':
        view = (
          <MainMenu
            switchView={this.switchView.bind(this)}
            loggedIn={this.state.loggedIn}
            setLoggedIn={this.setLoggedIn.bind(this)}
            setLoggedOut={this.setLoggedOut.bind(this)}
            username={this.state.username}
            email={this.state.email}
            lang={this.state.lang}
            changeLanguage={this.changeLanguage.bind(this)} 
            notify={this.notify.bind(this)}
            useLowQualityGraphics={this.state.useLowQualityGraphics}
            changeGraphicsSetting={this.changeGraphicsSetting.bind(this)}
            />
        );
        break;

      case 'gameplayview':
        var username = "";
        if (this.state.loggedIn) {
          username = this.state.username;
        } else {
          var rndNumber = Math.floor(Math.random() * 999999) + 1;
          username = 'guest' + rndNumber.toString();
        }
        view = (
          <Game 
            switchView={this.switchView.bind(this)}
            viewData={this.state.viewData}
            loggedIn={this.state.loggedIn}
            username={username}
            lowQuality={this.state.useLowQualityGraphics}
            lang={this.state.lang} />
        );
        break;
      case 'editorview':
        var username = "";
        if (this.state.loggedIn) {
          username = this.state.username;
        } else {
          var rndNumber = Math.floor(Math.random() * 999999) + 1;
          username = 'guest' + rndNumber.toString();
        }
        view = (
          <Editor 
            switchView={this.switchView.bind(this)}
            viewData={this.state.viewData}
            loggedIn={this.state.loggedIn}
            username={username}
            lang={this.state.lang}
            notify={this.notify.bind(this)} />
        );
        break;
      default:
        view = <div></div>;
        break;
    }
    return (
      <div className="App">
      <div onClick={this.hideNotificationBox.bind(this)}>
        <NotificationBox message={this.state.notification} />
      </div>
      
      <FadeInFadeOut in={this.state.viewAnimation}>
        {view}
      </FadeInFadeOut>
      </div>
    );
  }
}
