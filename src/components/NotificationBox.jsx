import React from 'react';
import './NotificationBox.css';

const NotificationBox = ({message}) => {
  let style = {display: 'none'}
  if(message) {
    style = {display: 'block'}
  }
  return <div style={style} className='notification-box'> <span>{message}</span> </div>
}

export default NotificationBox;