import React from 'react';
import License from './License';
import './About.css';

export default function About(props) {
  return (
    <div className="About">
      <div id="about">
        <div id="about-header">
          <h1>Forestry Game</h1>
          <p>version 1.0</p>
        </div>
        <div>
        <h1>Third party licenses</h1>
          <p id="license-text">
            <License />
          </p>
        </div>
      </div>
    </div>
  );
}
