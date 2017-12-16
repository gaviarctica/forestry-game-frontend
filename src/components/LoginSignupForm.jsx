import React, { Component } from 'react';
import Button from './Button';
import './LoginSignupForm.css';
import './api';
import DjangoCSRFToken from 'django-react-csrftoken'
import { LANG } from './lang';
import Loader from './Loader';


export default class LoginSignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      message: undefined,
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.view !== this.props.view) {
      this.setState({
        message: nextProps.message,
        username: '',
        password: '',
        email: '',
        loading: false
      });
    } else {
      this.setState({
        message: nextProps.message
      });
      if (this.state.loading) {
        this.setState({
          loading: false
        })
      }
    }
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value,
      message: undefined
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(e.target.id, this.state.username, this.state.password, this.state.email);
    this.setState({
      loading: true
    })
  }

  render() {
    var buttonStyle = {
      margin: 'auto',
      width: 'var(--form-width)',
      boxShadow: 'var(--menu-shadow-2)'
    };

    var hiddenSubmit = {
      display: 'none'
    };

    var emailField;
    var formButton;
    var loadingButton;
    if (this.props.view === 'signup') {
      emailField = (
        <input 
          type="text"
          id="email"
          name="email"
          placeholder={LANG[this.props.lang].mainMenu.loginSignupForm.email}
          value={this.state.email}
          onChange={this.handleInputChange.bind(this)} />
      );

      formButton = (
        <Button
          id="button-sign-up"
          text={LANG[this.props.lang].buttons.signUp}
          buttonType="primary"
          style={buttonStyle}
          handleClick={() => document.getElementById('form-submit').click()} />
      );

      loadingButton = (
        <Button
          id="button-sign-up"
          text={LANG[this.props.lang].buttons.loadingSignUp}
          buttonType="primary"
          style={buttonStyle} />
      );

    } else {

      formButton = (
        <Button
          id="button-log-in"
          text={LANG[this.props.lang].buttons.logIn}
          buttonType="primary"
          style={buttonStyle}
          handleClick={() => document.getElementById('form-submit').click()} />
      );

      loadingButton = (
        <Button
          id="button-sign-up"
          text={LANG[this.props.lang].buttons.loadingLogIn}
          buttonType="primary"
          style={buttonStyle} />
      );
    }
    
    return (
        <div className="LoginForm">

          <div id="component-form">

            {
              this.state.message ? 
                <div id="message">
                  {this.state.message.map(msg => {
                    return (
                      <p>
                        {LANG[this.props.lang].mainMenu.loginSignupForm.messages[msg]}
                      </p>
                    );
                  })}
                </div>
              : ''
            }

            <form id={this.props.view + '-form'} onSubmit={this.handleSubmit.bind(this)}>
              <DjangoCSRFToken />

              <input 
                type="text"
                id="username"
                name="username"
                placeholder={LANG[this.props.lang].mainMenu.loginSignupForm.username}           
                value={this.state.username}
                onChange={this.handleInputChange.bind(this)} />

              {this.props.view === 'signup' ? emailField : ''}

              <input 
                type="password"
                id="password"
                name="password"
                placeholder={LANG[this.props.lang].mainMenu.loginSignupForm.password}           
                value={this.state.password}
                onChange={this.handleInputChange.bind(this)} />

              <input id="form-submit" type="submit" style={hiddenSubmit} />

            </form>

            {
              this.state.loading ?
                <div>
                  {loadingButton}
                </div>
                : 
                <div>
                  {formButton}
                </div>
            }

          </div>
        </div>
    );
  }
}
