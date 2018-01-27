import React, { Component } from 'react';
import Button from './Button';
import './MapMenu.css';
import { TranslateRight, TranslateLeft, FadeInFadeOut } from './animation';
import './animation.css';
import Loader from './Loader';
import { API } from './api';
import { LANG } from './lang';

export default class MapMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: undefined,
      selectedMapIndex: 0,
      viewAnimation: false,
      scrollAnimationInProgress: false,
      loadingContent: true,
      selectedLevelCategory: 'default',
      searchString: ''
    }
  }

  componentWillMount() {
    var self = this;
    API.getOfficialMapsInfo(function(err, responseJson) {
      if (err) throw err;

      if (responseJson.length > 0) {
        self.setState({
          maps: responseJson
        });
      }
    });
  }

  componentDidMount() {
    this.setState({
      viewAnimation: true,
      loadingContent: false
    });

  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');
    var self = this;

    if (clicked === 'button-start-game') {
      this.props.switchView('gameplayview', {
        mapID: this.state.maps[this.state.selectedMapIndex].id
      });
    }
    if (clicked === 'button-show-default-maps') {
      this.changeLevelCategory('default');
    }
    if (clicked === 'button-show-user-maps') {
      this.changeLevelCategory('user');
    }
  }

  changeLevelCategory(newCat) {
    var self = this;
    if (!this.state.scrollAnimationInProgress) {
      this.setState({
        viewAnimation: false,
        scrollAnimationInProgress: true,
        loadingContent: true
      });

      setTimeout(function() {
        if (newCat === 'default') {
          API.getOfficialMapsInfo(function(err, responseJson) {
            if (err) throw err;
      
            if (responseJson.length > 0) {
              self.setState({
                maps: responseJson,
                selectedMapIndex: 0,
                selectedLevelCategory: newCat
              });
            } else {
              self.props.notify(LANG[self.props.lang].mainMenu.playTab.messages.noLevelsFound);
            }
          });
        } else if (newCat === 'user') {
          API.getMyMapsInfo(function(err, responseJson) {
            if (err) throw err;
      
            if (responseJson.length > 0) {
              self.setState({
                maps: responseJson,
                selectedMapIndex: 0,
                selectedLevelCategory: newCat
              });
            } else {
              self.props.notify(LANG[self.props.lang].mainMenu.playTab.messages.noLevelsFound);
            }
          });
        } else if (newCat === 'search') {
          API.searchMapsInfo(self.state.searchString, function(err, responseJson) {
            if (err) throw err;
      
            if (responseJson.length > 0) {
              self.setState({
                maps: responseJson,
                selectedMapIndex: 0,
                selectedLevelCategory: newCat
              });
            } else {
              self.props.notify(LANG[self.props.lang].mainMenu.playTab.messages.noLevelsFound);
            }
          });
        }
        
        self.setState({
          loadingContent: false,
          scrollAnimationInProgress: false,
          viewAnimation: true
        });
      }, 350);
    }
  }

  handlePreviousClick() {

    if (!this.state.scrollAnimationInProgress) {
      this.setState({
        viewAnimation: false,
        scrollAnimationInProgress: true,
        loadingContent: true
      });

      var self = this;

      setTimeout(function() {
        self.setState({
          loadingContent: false
        });
      }, 700);
      if (this.state.selectedMapIndex === 0) {
        setTimeout(function() {
          self.setState({
            selectedMapIndex: self.state.maps.length - 1,
            viewAnimation: true,
            scrollAnimationInProgress: false
          });
        }, 350);
      } else {
        setTimeout(function() {
          self.setState((prevState) => ({
            selectedMapIndex: prevState.selectedMapIndex - 1,
            viewAnimation: true,
            scrollAnimationInProgress: false
          }));
        }, 350);
      }
    }
  }

  handleNextClick() {

    if (!this.state.scrollAnimationInProgress) {
      this.setState({
        viewAnimation: false,
        scrollAnimationInProgress: true,
        loadingContent: true
      });

      var self = this;

      setTimeout(function() {
        self.setState({
          loadingContent: false
        });
      }, 700);
      if (this.state.selectedMapIndex === this.state.maps.length - 1) {
        setTimeout(function() {
          self.setState({
            selectedMapIndex: 0,
            viewAnimation: true,
            scrollAnimationInProgress: false
          });
        }, 350);
      } else {
        setTimeout(function() {
          self.setState((prevState) => ({
            selectedMapIndex: prevState.selectedMapIndex + 1,
            viewAnimation: true,
            scrollAnimationInProgress: false
          }));
        }, 350);
      }
    }
  }

  formatDate(dateString) {
    var date = new Date(dateString);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  }

  handleMapListClick(index) {
    if (!this.state.scrollAnimationInProgress) {
      this.setState({
        viewAnimation: false,
        scrollAnimationInProgress: true,
        loadingContent: true
      });

      var self = this;

      setTimeout(function() {
        self.setState({
          loadingContent: false,
          scrollAnimationInProgress: false,
          viewAnimation: true,
          selectedMapIndex: index
        });
      }, 350);
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      // Check that something is written
      if (this.state.searchString.replace(/\s/g, "").length > 0) {
        this.changeLevelCategory('search');
      }
    }
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  }

  render() {

    if (this.state.maps) {
      var selMap = this.state.maps[this.state.selectedMapIndex];

      var pileTypes = [];
      Object.keys(selMap.mapinfo.pileTypes).forEach(key => {
        if (selMap.mapinfo.pileTypes[key] > 0) {
          pileTypes.push(
            <div className="section-list-item" key={key}>
              <div className="section-list-item-name">
                {LANG[this.props.lang].logs['type' + (parseInt(key)+1)]}
              </div>
              <div className={'section-list-item-value value-type-' + key}>
                {selMap.mapinfo.pileTypes[key]}
              </div>
            </div>
          );
        }
      });

      var mapImage = {
        backgroundImage: 'url(/levelimage/' + selMap.id + '.svg?t=' + (new Date()).getTime() + ')'
      };

      var mapWeather = '';
      if (selMap.mapinfo.hasOwnProperty('weather') && selMap.mapinfo.weather.hasOwnProperty('type') && selMap.mapinfo.weather.type === 'fog') {
        mapWeather = 'foggy';
      } else {
        mapWeather = 'clear';
      }

      var selectedMapID = this.state.maps[this.state.selectedMapIndex].id;
    }

    if (this.state.maps === undefined) {
      return (
        <div className="MapMenu">
          <Loader />
        </div>
      );
    } else {
      return (
        <div className="MapMenu">
          <div id="map-menu">
            <div id="top">

              <div id="left">
                <div id="map-menu-settings">
                  <div className="section">
                    <div className="section-header">{LANG[this.props.lang].mainMenu.playTab.show}</div>
                    <div>
                      <Button
                        id="button-show-default-maps"
                        buttonType={this.state.selectedLevelCategory === 'default' ? 'mapmenu-show-type-button-selected' : 'mapmenu-show-type-button'}
                        text={LANG[this.props.lang].mainMenu.playTab.defaultLevels}
                        handleClick={this.handleButtonClick.bind(this)} />
                    
                    {this.props.loggedIn ?
                        <Button
                          id="button-show-user-maps"
                          buttonType={this.state.selectedLevelCategory === 'user' ? 'mapmenu-show-type-button-selected' : 'mapmenu-show-type-button'}
                          text={LANG[this.props.lang].mainMenu.playTab.myLevels}
                          handleClick={this.handleButtonClick.bind(this)} />
                    : ''}
                    </div>
                  </div>
                  <div className="section">
                    <div className="section-header">{LANG[this.props.lang].mainMenu.playTab.search}</div>
                    <div>
                      <input
                        type="text"
                        name="searchString"
                        value={this.state.searchString}
                        className="menu-search-input"
                        onKeyPress={this.handleKeyPress.bind(this)}
                        onChange={this.handleInputChange.bind(this)} />
                    </div>
                  </div>
                </div>
                <div id="map-list">
                  {this.state.maps.map((map, index) => {
                    return (
                      <div
                        className={selectedMapID === map.id ? 'section section-map selected' : 'section section-map'}
                        key={map.id}
                        onClick={() => this.handleMapListClick(index)} >
                        <div className="section-mapname">
                          {map.name}
                        </div>
                        <div className="section-mapinfo">
                          <span className="section-map-creator">{map.creator}</span>
                          <span className="section-map-date">{this.formatDate(map.last_edited)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div
                id="map-image-container"
                className={mapWeather === 'foggy' ? 'foggy-image-container' : ''} >
              {
                this.state.loadingContent ? (
                  <Loader />
                ) : ('')
              }
                <FadeInFadeOut in={this.state.viewAnimation}>
                  <div id="fading-content">
                    <div id="map-name">
                      {selMap.name}
                    </div>
                    <div
                      id="map-image"
                      className={mapWeather === 'foggy' ? 'foggy-image' : ''}
                      style={mapImage} >
                    </div>
                  </div>
                </FadeInFadeOut>

                <div
                  className="map-chevron"
                  id="map-chevron-left"
                  onClick={this.handlePreviousClick.bind(this)} >

                  {'<'}
                </div>

                <div
                  className="map-chevron"
                  id="map-chevron-right"
                  onClick={this.handleNextClick.bind(this)} >

                  {'>'}
                </div>

              </div>

              <div id="right">

              <div id="map-info">

                <div className="section">
                  <div className="section-header">
                    {LANG[this.props.lang].mainMenu.playTab.pileTypesAndAmounts}
                  </div>
                  {pileTypes}
                </div>

                <div className="section">
                  <div className="section-header">
                  {LANG[this.props.lang].mainMenu.playTab.routeLength}
                  </div>
                  <div className="section-value">
                    {selMap.mapinfo.routeLength + ' m'}
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                  {LANG[this.props.lang].mainMenu.playTab.storageAreaAmount}
                  </div>
                  <div className="section-value">
                    {selMap.mapinfo.storageAreas}
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                  {LANG[this.props.lang].mainMenu.playTab.roadAnomalies}
                  </div>
                  <div className="section-value">
                    {selMap.mapinfo.anomalies ? LANG[this.props.lang].mainMenu.playTab.yes : LANG[this.props.lang].mainMenu.playTab.no}
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                  {LANG[this.props.lang].mainMenu.playTab.weather}
                  </div>
                  <div className="section-value">
                    {LANG[this.props.lang].mainMenu.playTab[mapWeather]}
                  </div>
                </div>

              </div>

                <Button
                  id="button-start-game"
                  text={LANG[this.props.lang].buttons.startGame}
                  buttonType="primary"
                  handleClick={this.handleButtonClick.bind(this)} />
              </div>

            </div>

              <div id="bottom-row">
                {(this.state.selectedMapIndex + 1) + '/' + this.state.maps.length}
              </div>
          </div>
        </div>
      );
    }
  }
}
