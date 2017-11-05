import React, { Component } from 'react';
import './LangSelection.css';

var languages = {
  'fi': {
    name: 'Suomi',
    icon: '/static/flag-fi.png'
  },
  'en': {
    name: 'English',
    icon: '/static/flag-en.png'
  }
}

export default class LangSelection extends Component {

  toggleLang() {
    if (this.props.lang === 'fi') {
      this.props.changeLanguage('en');
    } else if (this.props.lang === 'en') {
      this.props.changeLanguage('fi');
    }
  }

  render() {
    var flagStyle = {
      backgroundImage: 'url(' + languages[this.props.lang].icon + ')'
    };

    return (
      <div className="LangSelection" >

        <div
          className="lang-sel-flag"
          style={flagStyle}
          onClick={this.toggleLang.bind(this)} >
        </div>

        <div
          className="lang-sel-text"
          onClick={this.toggleLang.bind(this)} >

          {languages[this.props.lang].name}
        </div>

      </div>
    );
  }
}
