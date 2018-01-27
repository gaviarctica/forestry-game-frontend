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

    case 'editor-maplist-button':
    case 'editor-maplist-button-selected':
      buttonClass = buttonClass + ' editor-maplist-button';
      if (props.buttonType === 'editor-maplist-button-selected') {
        buttonClass = buttonClass + ' primary';
      }
      break;

    case 'mapmenu-show-type-button':
    case 'mapmenu-show-type-button-selected':
      buttonClass = buttonClass + ' mapmenu-show-type-button';
      if (props.buttonType === 'mapmenu-show-type-button-selected') {
        buttonClass = buttonClass + ' primary';
      }
      break;

    case 'graphics-button':
    case 'graphics-button-selected':
      buttonClass = buttonClass + ' graphics-button';
      if (props.buttonType === 'graphics-button-selected') {
        buttonClass = buttonClass + ' primary';
      }
      break;

    case 'close-or-delete':
      buttonClass = buttonClass + ' delete-button';
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
      onClick={props.inactive ? '' : props.handleClick} >

    {props.icon ? <Icon size={'1.3em'} icon={props.icon} className="navbar-icon"/> : ''}

    {props.buttonType == 'close-or-delete' ? 'x' : props.text}
    
    </div>
  );
}
