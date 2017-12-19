import React from 'react';
import './GameStat.css';

export default function GameStat(props) {

  return (
    <div className={props.content ? 'GameStat has-content' : 'GameStat'}>
      <div className="gamestat-header">
        {props.header}
      </div>
      <div className="gamestat-content">
        {props.value && 
          <div className="gamestat-value">
            {props.value}
          </div>
        }
        {props.content && 
          <div>
            {props.content}
          </div>
        }
      </div>
    </div>
  );
}
