import React, { Component } from 'react';
import './App.css';
import MainMenu from './MainMenu';
import MapMenu from './MapMenu';
import Profile from './Profile';
import Game from './Game';
import { FadeInFadeOut } from './animation';
import './animation.css';
import { API } from './api';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'mainmenu',
      loggedIn: false,
      username: '',
      email: '',
      lang: 'fi',
      viewAnimation: false
    }
  }

  componentWillMount() {
    // Get CSRF token from Django for forms
    var self = this;
    API.validateSession(function(err, username, email) {
      if (err) throw err;
      if (username) {
        self.setState({
          loggedIn: true,
          username: username,
          email: email
        });
      }
    });
  }

  componentDidMount() {
    // Display first view enter animation
    this.setState({
      viewAnimation: true
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

  switchView(newView) {
    // display view exit animation
    this.setState({
      viewAnimation: false
    });

    // After exit animation, switch view and start new view enter animation
    var self = this;
    setTimeout(function() {
      self.setState({
        currentView: newView,
        viewAnimation: true
      });
    }, 350); // Duration of fade out animation
       
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
            username={this.state.username}
            email={this.state.email}
            lang={this.state.lang}
            changeLanguage={this.changeLanguage.bind(this)} />
        );
        break;

      case 'mapmenu':
        view = (
          <MapMenu
            switchView={this.switchView.bind(this)}
            loggedIn={this.state.loggedIn}
            username={this.state.username}
            lang={this.state.lang} />
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
            loggedIn={this.state.loggedIn}
            username={username} />
        );
        break;

      default:
        view = <div>You should never see this text.</div>;
        break;
    }
    return (
      <div className="App">
      <FadeInFadeOut in={this.state.viewAnimation}>
        {view}
      </FadeInFadeOut>
        
      </div>
    );
  }
}
