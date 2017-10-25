import React, { Component } from 'react';
import Button from './Button';
import './LoginSignupForm.css';
import { FadeInFadeOut, TranslateDown } from './animation';
import './animation.css';
import './api';
import DjangoCSRFToken from 'django-react-csrftoken'


export default class LoginSignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'login',
      username: '',
      password: '',
      email: '',
      message: undefined,
      viewAnimation: true,
      formSwitchAnimationInProgress: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      message: nextProps.message
    });
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value,
      message: undefined
    });
  }

  handleSignupLinkClick() {
    if (!this.state.formSwitchAnimationInProgress) {
      this.setState({
        viewAnimation: false,
        formSwitchAnimationInProgress: true
      });

      var self = this;
      setTimeout(function() {
        if (self.state.currentView === 'login') {
          self.setState({
            currentView: 'signup',
            viewAnimation: true,
            formSwitchAnimationInProgress: false,
            message: undefined
          });
        } else {
          self.setState({
            currentView: 'login',
            viewAnimation: true,
            formSwitchAnimationInProgress: false,
            message: undefined
          });
        }
      }, 350); // Exit animation duration
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(e.target.id, this.state.username, this.state.password, this.state.email);
  }

  render() {
    var buttonStyle = {
      margin: 'auto',
      width: 'var(--form-width)',
      backgroundColor: 'var(--jd-yellow)',
      boxShadow: 'var(--menu-shadow-2)'
    };

    var hiddenSubmit = {
      display: 'none'
    };

    var emailField;
    var formButton;
    if (this.state.currentView === 'signup') {
      emailField = (
        <input 
          type="text"
          id="email"
          name="email"
          placeholder="email"
          value={this.state.email}
          onChange={this.handleInputChange.bind(this)} />
      );

      formButton = (
        <Button
          id="button-sign-up"
          text="Sign up"
          style={buttonStyle}
          handleClick={() => document.getElementById('form-submit').click()} />
      );

    } else {

      formButton = (
        <Button
          id="button-log-in"
          text="Log in"
          style={buttonStyle}
          handleClick={() => document.getElementById('form-submit').click()} />
      );
    }

    return (
      <TranslateDown in={this.state.viewAnimation}>
      <FadeInFadeOut in={this.state.viewAnimation}>
        <div className="LoginForm">

          <div id="component-form">

            {this.state.message ? <div id="message">{this.state.message}</div> : ''}

            <form id={this.state.currentView + '-form'} onSubmit={this.handleSubmit.bind(this)}>
              <DjangoCSRFToken />

              <input 
                type="text"
                id="username"
                name="username"
                placeholder="username"            
                value={this.state.username}
                onChange={this.handleInputChange.bind(this)} />

              {this.state.currentView === 'signup' ? emailField : ''}

              <input 
                type="password"
                id="password"
                name="password"
                placeholder="password"            
                value={this.state.password}
                onChange={this.handleInputChange.bind(this)} />

              <input id="form-submit" type="submit" style={hiddenSubmit} />

            </form>

            {formButton}

          </div>

          <div id="signup-message">

            {this.state.currentView === 'login' ? 'Don\'t have and account? ' : 'Already have an account? '}
            
            <span
              id="signup-link"
              onClick={this.handleSignupLinkClick.bind(this)} >

              {this.state.currentView === 'login' ? 'Sign Up' : 'Log In'}

            </span>
            
            {' here!'}

          </div>

        </div>
      </FadeInFadeOut>
      </TranslateDown>
    );
  }
}
