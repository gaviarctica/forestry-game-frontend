import React from 'react';
import './FloatingMenu.css';

export default function FloatingMenu(props) {
  return (
    <div className="FloatingMenu" id={props.id}>
      {props.buttons.map((button, i) => {
        return <div className="button-wrapper" key={i}>{button}</div>
      })}
    </div>
  );
}
