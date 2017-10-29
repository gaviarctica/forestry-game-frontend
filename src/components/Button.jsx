import React from 'react';
import './Button.css';
import Icon from 'react-icons-kit';

export default function Button(props) {

  var buttonClass = 'Button';
  switch (props.buttonType) {
    case 'primary':
      buttonClass = buttonClass + ' primary';
      break;

    case 'navbar-tab':
    case 'navbar-tab-active':
    buttonClass = buttonClass + ' navbar-tab';
      if (props.buttonType === 'navbar-tab-active') {
        buttonClass = buttonClass + ' navbar-tab-active';
      }
      break;
    
    default:
      break;
  }

  if (props.inactive) {
    buttonClass = buttonClass + ' inactive';
  }

  return (
    <div
      className={buttonClass}
      id={props.id}
      style={props.style}
      onClick={props.handleClick} >

    {props.icon ? <Icon size={'1.3em'} icon={props.icon} className="navbar-icon"/> : ''}

    {props.text}
    
    </div>
  );
}
