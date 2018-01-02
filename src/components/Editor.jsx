import React, { Component } from 'react';
import './Editor.css';
import Button from './Button';
import EditorCanvas from '../editor/editor';
import FloatingMenu from './FloatingMenu';
import { API } from './api';
import { LANG } from './lang';
import Settings from '../game/settings';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeToolButton: 'road',
      activeTool: 'road_normal',
      menuOpen: false,
      loadMenuOpen: false,
      dyingRoadLimit: 1,
      weightlimitedRoadLimit: 0,
      ableToSave: false,
      userLevels: undefined,
      selectedUserLevel: undefined,
      loadedMapData: undefined
    }

    this.toolImagePaths = {
      'road_normal': '/static/road.png',
      'road_dying': '/static/road.png',
      'road_weightlimit': '/static/road.png',
      'road_oneway': '/static/road.png',
      'logs_0': '/static/log0.png',
      'logs_1': '/static/log1.png',
      'logs_2': '/static/log2.png',
      'logs_3': '/static/log3.png',
      'logs_4': '/static/log4.png',
      'logs_5': '/static/log5.png',
      'deposits_free': '/static/deposit_empty.svg',
      'deposits_0': '/static/deposit_0.svg',
      'deposits_1': '/static/deposit_1.svg',
      'deposits_2': '/static/deposit_2.svg',
      'deposits_3': '/static/deposit_3.svg',
      'deposits_4': '/static/deposit_4.svg',
      'deposits_5': '/static/deposit_5.svg',
      'truck': '/static/truck.svg',
      'remove': '/static/editor_remove.png'
    }

    this.settings = new Settings();
  }

  updateUI(update) {
    this.setState(update);
  }

  componentDidMount() {
    var self = this;
    self.editorCanvas = new EditorCanvas(self.updateUI.bind(self));
    this.loadUserLevels();
  }

  loadUserLevels() {
    var self = this;
    // TODO: get only user's levels
    API.getAllMapsInfo(function(err, maps) {
      if (err) throw err;
      self.setState({
        userLevels: maps
      });
      console.log('TODO: get only user levels!');
    });
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleButtonClick(e) {
    var clicked = e.target.getAttribute('id');
    var clickedClass = e.target.getAttribute('class');
    var self = this;

    if (clicked === 'button-quit-editor') {
      this.editorCanvas.destroy();
      this.props.switchView('mainmenu');
    }
    if (clicked === 'button-road') {
      this.editorCanvas.selectTool('road');
      this.setState({
        activeToolButton: 'road'
      });
      this.updateActiveTool('road');
    }
    if (clicked === 'button-logs') {
      this.editorCanvas.selectTool('log');
      this.setState({
        activeToolButton: 'logs'
      });
      this.updateActiveTool('logs');
    }
    if (clicked === 'button-deposits') {
      this.editorCanvas.selectTool('deposit');
      this.setState({
        activeToolButton: 'deposits'
      });
      this.updateActiveTool('deposits');
    }
    if (clicked === 'button-truck') {
      this.editorCanvas.selectTool('truck');
      this.setState({
        activeToolButton: 'truck',
        activeTool: 'truck'
      });
    }
    if (clicked === 'button-remove') {
      this.editorCanvas.selectTool('remove');
      this.setState({
        activeToolButton: 'remove',
        activeTool: 'remove'
      });
    }
    if (clicked === 'button-editormenu') {
      this.setState(prevState => ({
        menuOpen: !prevState.menuOpen,
        loadMenuOpen: false
      }));
    }
    if (clicked === 'button-save') {
      var mapData = this.editorCanvas.serializeLevel();
      var mapInfo = this.editorCanvas.levelInfo();
      API.addMap("editorMap", JSON.stringify(mapData), JSON.stringify(mapInfo), function(err) {
        console.log(err);
      });
    }
    if (clicked === 'button-load') {
      // Open load menu only if levels already loaded
      if (this.state.userLevels) {
        this.setState({
          loadMenuOpen: true
        });
      }
    }
    if (clicked === 'button-editor-mapmenu-back') {
      this.setState({
        loadMenuOpen: false,
        selectedUserLevel: undefined
      });
    }
    if (clickedClass === 'Button editor-maplist-button') {
      let clickedParts = clicked.split('-');
      let clickedID = clickedParts[clickedParts.length - 1];
      this.setState({
        selectedUserLevel: clickedID
      });
    }
    if (clicked === 'button-editor-mapmenu-load') {
      if (this.state.selectedUserLevel) {
        API.getMapData(this.state.selectedUserLevel, function(err, mapdata) {
          if (err) throw err;
          self.setState({
            loadedMapData: mapdata[0].mapdata
          });
        });
      }
    }
  }

  updateActiveTool(button) {
    let newTool;
    if (button === 'logs') {
      newTool = 'logs_' + document.getElementById('log-tool-type').value;
    }
    if (button === 'deposits') {
      newTool = 'deposits_' + document.getElementById('deposit-tool-type').value;
    }
    if (button === 'road') {
      newTool = 'road_' + document.getElementById('road-tool-type').value;
    }
    this.setState({
      activeTool: newTool
    });
  }

  getMenuButtons() {
    return[
      <Button 
        id="button-save"
        text={LANG[this.props.lang].buttons.save}
        buttonType='default'
        inactive={!this.state.ableToSave}
        handleClick={this.handleButtonClick.bind(this)} />,
      <Button 
        id="button-save-as"
        text={LANG[this.props.lang].buttons.saveAs}
        buttonType='default'
        inactive={!this.state.ableToSave}
        handleClick={this.handleButtonClick.bind(this)} />,
      <Button 
        id="button-load"
        text={LANG[this.props.lang].buttons.loadLevel}
        buttonType='default'
        inactive={!this.state.userLevels}
        handleClick={this.handleButtonClick.bind(this)} />,
      <Button 
        id="button-quit-editor"
        text={LANG[this.props.lang].buttons.quit}
        buttonType='default'
        handleClick={this.handleButtonClick.bind(this)} />
    ];
  }

  getLoadMenuContent() {
    let mapImage = this.state.selectedUserLevel ? {
      backgroundImage: 'url(/levelimage/' + this.state.selectedUserLevel + '.svg)'
    } : {};

    return (
      <div id="editor-mapmenu">
        <div id="editor-mapmenu-buttonrow">
          <Button
            id="button-editor-mapmenu-back"
            text={LANG[this.props.lang].buttons.back}
            buttonType='default'
            handleClick={this.handleButtonClick.bind(this)} />
          <Button
            id="button-editor-mapmenu-load"
            text={LANG[this.props.lang].buttons.loadLevel}
            buttonType='primary'
            inactive={this.state.selectedUserLevel ? false : true}
            handleClick={this.handleButtonClick.bind(this)} />
        </div>
        <div id="editor-mapmenu-bottomrow">
          <div id="editor-mapmenu-list">
            {this.state.userLevels ? this.state.userLevels.map(level => {
              return (
                <Button
                  key={level.id}
                  buttonType={this.state.selectedUserLevel === level.id.toString() ? 'editor-maplist-button-selected' : 'editor-maplist-button'}
                  id={'editor-mapmenu-level-' + level.id}
                  text={level.name}
                  handleClick={this.handleButtonClick.bind(this)} />
              )
            }) : ''}
          </div>
          <div id="editor-mapmenu-image" style={mapImage}></div>
        </div>
      </div>
    );
  }

  render() {
    var activeToolStyle = {
      backgroundImage: 'url("' + this.toolImagePaths[this.state.activeTool] + '")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center'
    }

    var menuButtons = this.getMenuButtons();    
    var loadMenuContent = this.getLoadMenuContent();

    return (
      <div className="Editor">

        <div id="canvas-editor"></div>
      
        <div id="editor-toolbar">

          <Button
            id="button-editormenu"
            text={LANG[this.props.lang].buttons.menu}
            buttonType={this.state.menuOpen ? 'primary' : 'default'}
            handleClick={this.handleButtonClick.bind(this)} />

          <div className="toolbar-header">{LANG[this.props.lang].editor.selectedTool}</div>
          <div id="toolbar-active-tool" style={activeToolStyle}></div>

          <div className="toolbar-header">{LANG[this.props.lang].editor.tools}</div>
          <div id="toolbar-tools">
            <Button 
              id="button-road"
              text={LANG[this.props.lang].buttons.road}
              buttonType={this.state.activeToolButton === 'road' ? 'primary' : 'default'}
              handleClick={this.handleButtonClick.bind(this)} />
            <Button 
              id="button-logs"
              text={LANG[this.props.lang].buttons.logs}
              buttonType={this.state.activeToolButton === 'logs' ? 'primary' : 'default'}
              handleClick={this.handleButtonClick.bind(this)} />
            <Button 
              id="button-deposits"
              text={LANG[this.props.lang].buttons.deposits}
              buttonType={this.state.activeToolButton === 'deposits' ? 'primary' : 'default'}
              handleClick={this.handleButtonClick.bind(this)} />
            <Button 
              id="button-truck"
              text={LANG[this.props.lang].buttons.truck}
              buttonType={this.state.activeToolButton === 'truck' ? 'primary' : 'default'}
              handleClick={this.handleButtonClick.bind(this)} />
            <Button 
              id="button-remove"
              text={LANG[this.props.lang].buttons.remove}
              buttonType={this.state.activeToolButton === 'remove' ? 'primary' : 'default'}
              handleClick={this.handleButtonClick.bind(this)} />
          </div>

          <div
            className="toolbar-header"
            style={['logs', 'deposits', 'road'].indexOf(this.state.activeToolButton) === -1 ? {display: 'none'} : {}} >
              {LANG[this.props.lang].editor.toolType}
          </div>
          <select
            name="tool-type"
            className="tool-type-dropdown"
            id="log-tool-type"
            style={this.state.activeToolButton !== 'logs' ? {display: 'none'} : {}}
            onChange={() => this.updateActiveTool('logs')} >
              <option value="0">{LANG[this.props.lang].logs.type1}</option>
              <option value="1">{LANG[this.props.lang].logs.type2}</option>
              <option value="2">{LANG[this.props.lang].logs.type3}</option>
              <option value="3">{LANG[this.props.lang].logs.type4}</option>
              <option value="4">{LANG[this.props.lang].logs.type5}</option>
              <option value="5">{LANG[this.props.lang].logs.type6}</option>
          </select>
          <select
            name="tool-type"
            className="tool-type-dropdown"
            id="deposit-tool-type"
            style={this.state.activeToolButton !== 'deposits' ? {display: 'none'} : {}}
            onChange={() => this.updateActiveTool('deposits')} >
              <option value="free">{LANG[this.props.lang].editor.free}</option>
              <option value="0">{LANG[this.props.lang].logs.type1}</option>
              <option value="1">{LANG[this.props.lang].logs.type2}</option>
              <option value="2">{LANG[this.props.lang].logs.type3}</option>
              <option value="3">{LANG[this.props.lang].logs.type4}</option>
              <option value="4">{LANG[this.props.lang].logs.type5}</option>
              <option value="5">{LANG[this.props.lang].logs.type6}</option>
          </select>
          <select
            name="tool-type"
            className="tool-type-dropdown"
            id="road-tool-type"
            style={this.state.activeToolButton !== 'road' ? {display: 'none'} : {}}
            onChange={() => this.updateActiveTool('road')} >
            <option value="normal">{LANG[this.props.lang].editor.normalRoad}</option>
            <option value="dying">{LANG[this.props.lang].editor.dyingRoad}</option>
            <option value="weightlimit">{LANG[this.props.lang].editor.weightLimitedRoad}</option>
            <option value="oneway">{LANG[this.props.lang].editor.onewayRoad}</option>
          </select>

          <div
            className="details-road"
            id="details-road-dying"
            style={this.state.activeTool !== 'road_dying' ? {display: 'none'} : {}} >
              {LANG[this.props.lang].editor.maxCrossings + ': '}
              <input
                type="number"
                min="1"
                value={this.state.dyingRoadLimit}
                name="dyingRoadLimit" 
                onChange={this.handleInputChange.bind(this)} />
          </div>
          <div
            className="details-road"
            id="details-road-weightlimit"
            style={this.state.activeTool !== 'road_weightlimit' ? {display: 'none'} : {}} >
              {LANG[this.props.lang].editor.maxLoad + ': '}
              <input
                type="number"
                min="0"
                step={this.settings.log.Weight}
                value={this.state.weightlimitedRoadLimit}
                name="weightlimitedRoadLimit"
                onChange={this.handleInputChange.bind(this)} />
              {' kg'}
          </div>
        </div>

        {this.state.menuOpen ?
          this.state.loadMenuOpen ?
            <FloatingMenu
              id='editor-menu'
              type='content'
              content={loadMenuContent} />
            :
            <FloatingMenu
              id='editor-menu'
              type='buttons'
              buttons={menuButtons} />
          : ''
        }
        
      </div>
    );
  }
}
