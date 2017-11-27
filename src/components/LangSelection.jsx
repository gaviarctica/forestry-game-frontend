import React, { Component } from 'react';
import './LangSelection.css';
import { LANG } from './lang';

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
      backgroundImage: 'url(' + LANG[this.props.lang].icon + ')'
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

          {LANG[this.props.lang].langName}
        </div>

      </div>
    );
  }
}
