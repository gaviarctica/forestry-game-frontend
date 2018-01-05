import React from 'react';
import './FloatingMenu.css';

export default function FloatingMenu(props) {
  if (props.type === 'buttons') {
    return (
      <div className="FloatingMenu" id={props.id}>
        {props.buttons.map((button, i) => {
          return <div className="button-wrapper" key={i}>{button}</div>
        })}
      </div>
    );
  } else if (props.type === 'content') {
    return (
      <div className="FloatingMenu" id={props.id}>
        {props.content}
      </div>
    );
  }
  
}
