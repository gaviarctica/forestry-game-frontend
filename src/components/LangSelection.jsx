import React, { Component } from 'react';
import './LangSelection.css';

var languages = {
  'fi': {
    name: 'Suomi',
    icon: '/flag-fi.png'
  },
  'en': {
    name: 'English',
    icon: '/flag-en.png'
  }
}

export default class LangSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  toggleList() {
    this.setState((prevState) => ({
      open: !prevState.open
    }));
  }

  handleLanguageClick(lang) {
    this.props.changeLanguage(lang);
    this.setState({
      open: false
    });
  }

  render() {
    var flagStyle;
    var elemToRender;
    if (this.state.open) {

      var langs = [];
      for (var lang in languages) {
        flagStyle = {
          backgroundImage: 'url(' + languages[lang].icon + ')'
        };

        langs.push(
          <div
            key={lang}
            onClick={this.handleLanguageClick.bind(this, lang)} >

            <div
              className="lang-sel-flag"
              id={'sel-' + lang}
              style={flagStyle} >
            </div>

            <div className="lang-sel-text" >

              {languages[lang].name}

            </div>
          
          </div>
        );
      }

      elemToRender = (
        <div>
          
          {langs}

        </div>
      );

    } else {

      flagStyle = {
        backgroundImage: 'url(' + languages[this.props.lang].icon + ')'
      };

      elemToRender = (
        <div>

          <div
            className="lang-sel-flag"
            style={flagStyle}
            onClick={this.toggleList.bind(this)} >
          </div>

          <div
            className="lang-sel-text"
            onClick={this.toggleList.bind(this)} >

            {languages[this.props.lang].name}

          </div>
        
        </div>
      );
    }

    return (
      <div
        className="LangSelection"
        style={this.props.style} >

        {elemToRender}

      </div>
    );
  }
}
