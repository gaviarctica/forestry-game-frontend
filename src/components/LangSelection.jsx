import React, { Component } from 'react';
import './LangSelection.css';
import { LANG } from './lang';

export default class LangSelection extends Component {
  constructor(props) {
    super(props);

    // If adding a new language, add language ID here
    this.languages = [
      'en',
      'fi'
    ];
  }

  toggleLang() {
    // Cycle to the next language
    var currentLangIndex = this.languages.indexOf(this.props.lang);
    var nextLangIndex;
    if (currentLangIndex === (this.languages.length - 1)) {
      nextLangIndex = 0;
    } else {
      nextLangIndex = currentLangIndex + 1;
    }
    this.props.changeLanguage(this.languages[nextLangIndex]);
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
