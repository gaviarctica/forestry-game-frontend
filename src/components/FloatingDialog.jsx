import React, { Component } from 'react';
import Button from './Button';
import './FloatingDialog.css';

export default class FloatingDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (value.length <= this.props.maxLength) {
      this.setState({
        [name]: value
      });
    }
  }

  render() {
    if (this.props.type === 'textinput') {
      return (
        <div className="FloatingDialog" id={this.props.id}>
          <div className="header">
            {this.props.header}
          </div>
          <input
            type="text"
            value={this.state.input}
            name="input" 
            onChange={this.handleInputChange.bind(this)} />
          <Button
            id="floating-dialog-button-secondary"
            text={this.props.secondaryText}
            buttonType="default"
            handleClick={() => this.props.handleSecondaryClick()} />
          <Button
            id="floating-dialog-button-primary"
            text={this.props.primaryText}
            buttonType="primary"
            inactive={this.state.input === ''}
            handleClick={() => this.props.handlePrimaryClick(this.state.input)} />
        </div>
      );
    }
  }
}
