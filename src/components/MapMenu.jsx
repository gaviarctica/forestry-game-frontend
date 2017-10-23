import React, { Component } from 'react';
import Button from './Button';
import './MapMenu.css';
import { TranslateRight, TranslateLeft, FadeInFadeOut, Slide } from './animation';
import './animation.css';

var dummyMaps = [
  {
    name: 'Map with 4 types',
    image: 'https://placekitten.com/1001/601',
    pileTypes: [
      {
        name: 'Birch Sawlog',
        amount: 3
      },
      {
        name: 'Birch Pulp',
        amount: 22
      },
      {
        name: 'Pine Pulp',
        amount: 31
      },
      {
        name: 'Spruce Pulp',
        amount: 3
      }
    ],
    routeLength: 4184.3,
    storageAreas: 3,
    passingLimit: false
  },
  {
    name: 'Another map',
    image: 'https://placekitten.com/801/701',
    pileTypes: [
      {
        name: 'Pine Sawlog',
        amount: 45
      },
      {
        name: 'Mystery Wood',
        amount: 99
      }
    ],
    routeLength: 234.1,
    storageAreas: 1,
    passingLimit: false
  },
  {
    name: 'Third map\'s the charm',
    image: 'https://placekitten.com/1101/401',
    pileTypes: [
      {
        name: 'Pine Pulp',
        amount: 1
      }
    ],
    routeLength: 9000.1,
    storageAreas: 50,
    passingLimit: false
  }
];

export default class MapMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: dummyMaps,
      selectedMapIndex: 0,
      appearAnimation: false,
      viewAnimation: false,
      scrollAnimationInProgress: false
    }
  }

  componentDidMount() {
    this.setState({
      appearAnimation: true,
      viewAnimation: true
    });
  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');

    if (clicked === 'button-back') {
      this.props.switchView('mainmenu');
    } else if (clicked === 'button-start-game') {
      this.props.switchView('gameplayview');
    }
  }

  handlePreviousClick() {

    if (!this.state.scrollAnimationInProgress) {
      this.setState({
        viewAnimation: false,
        scrollAnimationInProgress: true
      });

      var self = this;
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
        scrollAnimationInProgress: true
      });

      var self = this;
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

    var selMap = this.state.maps[this.state.selectedMapIndex];

    var pileTypes = selMap.pileTypes.map(pileType => 
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
      backgroundImage: 'url(' + selMap.image + ')'
    };

    var firstMap = this.state.selectedMapIndex === 0 ? true : false;
    var lastMap = this.state.selectedMapIndex === this.state.maps.length - 1 ? true : false;

    return (
      <div className="MapMenu">
        
        <div id="map-menu">

          <div id="top">

            <TranslateRight in={this.state.appearAnimation}>
              <div id="left">

                <Button
                  id="button-back"
                  text="Back to menu"
                  handleClick={this.handleButtonClick.bind(this)} />

                <Button
                  id="button-create-map"
                  text="Create map"
                  handleClick={this.handleButtonClick.bind(this)}
                  inactive={this.props.loggedIn ? false : true} />

                <div id="map-info">

                  <div className="section">

                    <div className="section-header">
                      Pile Types and Amounts
                    </div>

                    {pileTypes}

                  </div>

                  <div className="section">

                    <div className="section-header">
                      Route Length
                    </div>

                    <div className="section-value">
                      {selMap.routeLength + ' m'}
                    </div>

                  </div>

                  <div className="section">

                    <div className="section-header">
                      Storage Area Amount
                    </div>

                    <div className="section-value">
                      {selMap.storageAreas}
                    </div>

                  </div>

                  <div className="section">

                    <div className="section-header">
                      Passing Limit
                    </div>

                    <div className="section-value">
                      {selMap.passingLimit ? 'YES' : 'NO'}
                    </div>

                  </div>

                </div>

                <Button
                  id="button-start-game"
                  text="Start game"
                  style={{backgroundColor: 'var(--jd-yellow)'}}
                  handleClick={this.handleButtonClick.bind(this)} />

              </div>
            </TranslateRight>

            <TranslateLeft in={this.state.appearAnimation}>
            
            
              <div id="right">

                <FadeInFadeOut in={this.state.viewAnimation}>
                <div id="fading-content">
                  <div id="map-name">
                    {selMap.name}
                  </div>
                  <div id="map-image" style={mapImage}></div>
                </div>
                </FadeInFadeOut>

                <div
                  className={firstMap ? 'map-chevron map-chevron-inactive' : 'map-chevron'}
                  id="map-chevron-left"
                  onClick={firstMap ? '' : this.handlePreviousClick.bind(this)} >

                  {'<'}

                </div>

                <div
                  className={lastMap ? 'map-chevron map-chevron-inactive' : 'map-chevron'}
                  id="map-chevron-right"
                  onClick={lastMap ? '' : this.handleNextClick.bind(this)} >

                  {'>'}

                </div>

              </div>
            
            </TranslateLeft>

          </div>

          <TranslateLeft in={this.state.appearAnimation}>
            <div id="bottom-row">
              {(this.state.selectedMapIndex + 1) + '/' + this.state.maps.length}
            </div>
          </TranslateLeft>

        </div>

      </div>
    );
  }
}
