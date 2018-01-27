import React from 'react';
import './Loader.css';

export default function Loader(props) {
  var loaderClass = 'Loader';
  switch(props.loaderClass){
    case 'loginsignup':
      loaderClass = props.loaderClass;
      break;
    default:
      break;
  }

  return (
    <div className={loaderClass}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
