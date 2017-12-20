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
      appearAnimation: false,
      viewAnimation: false,
      scrollAnimationInProgress: false,
      loadingContent: true
    }
  }

  componentWillMount() {
    var self = this;
    API.getAllMapsInfo(function(err, responseJson) {
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
      appearAnimation: true,
      viewAnimation: true,
      loadingContent: false
    });

  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');

    if (clicked === 'button-back') {
      this.props.switchView('mainmenu');
    } else if (clicked === 'button-start-game') {
      this.props.switchView('gameplayview', {
        mapID: this.state.maps[this.state.selectedMapIndex].id
      });
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
            appearAnimation: false,
            viewAnimation: true,
            scrollAnimationInProgress: false
          });
        }, 350);
      } else {
        setTimeout(function() {
          self.setState((prevState) => ({
            selectedMapIndex: prevState.selectedMapIndex - 1,
            appearAnimation: false,
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
            appearAnimation: false,
            viewAnimation: true,
            scrollAnimationInProgress: false
          });
        }, 350);
      } else {
        setTimeout(function() {
          self.setState((prevState) => ({
            selectedMapIndex: prevState.selectedMapIndex + 1,
            appearAnimation: false,
            viewAnimation: true,
            scrollAnimationInProgress: false
          }));
        }, 350);
      }
    }
  }

  render() {

    if (this.state.maps) {
      var selMap = this.state.maps[this.state.selectedMapIndex];

      var pileTypes = selMap.mapinfo.pileTypes.map(pileType =>
        <div className="section-list-item" key={pileType.name}>
          <div className="section-list-item-name">
            {pileType.name}
          </div>
          <div className="section-list-item-value">
            {pileType.amount}
          </div>
        </div>
      );

      var mapImage = {
        backgroundImage: 'url(/levelimage/' + selMap.id + '.svg)'
      };
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

              <TranslateRight in={this.state.appearAnimation}>
                <div id="left">
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
                      <div id="map-image" style={mapImage}></div>
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
              </TranslateRight>

              <TranslateLeft in={this.state.appearAnimation}>
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
                      {selMap.mapinfo.passingLimit ? 'YES' : 'NO'}
                    </div>
                  </div>

                </div>

                  <Button
                    id="button-start-game"
                    text={LANG[this.props.lang].buttons.startGame}
                    buttonType="primary"
                    handleClick={this.handleButtonClick.bind(this)} />
                </div>
              </TranslateLeft>

            </div>

            <TranslateRight in={this.state.appearAnimation}>
              <div id="bottom-row">
                {(this.state.selectedMapIndex + 1) + '/' + this.state.maps.length}
              </div>
            </TranslateRight>
          </div>
        </div>
      );
    }
  }
}
