import React, { Component } from 'react';
import './App.css';
import MainMenu from './MainMenu';
import MapMenu from './MapMenu';
import Game from './Game';
import { FadeInFadeOut } from './animation';
import './animation.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'mainmenu',
      loggedIn: false,
      username: '',
      lang: 'fi',
      viewAnimation: false
    }
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

  login(username) {
    this.setState({
      loggedIn: true,
      username: username
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
            login={this.login.bind(this)}
            username={this.state.username}
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
