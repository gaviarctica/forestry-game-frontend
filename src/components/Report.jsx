import React from 'react';
import './Report.css';
import { LANG } from './lang';

export default function Report(props) {

  var date = new Date(props.enddate);

  return (
    <div id={props.type == "endgame_report" ? "endgame-report" : "report"}>
      <h1>{LANG[props.lang].report.report}</h1>
      <div id="report-header">
        <div>
          <p>{date.getDate()}.{date.getMonth()}.{date.getFullYear()}, {date.getHours()}:{date.getMinutes()<10?'0':''}{date.getMinutes()}</p>
          <p>{LANG[props.lang].report.map}: {props.mapname}</p>
        </div>
        <div>
          <h2>{LANG[props.lang].report.stats}</h2>
          <p>{LANG[props.lang].report.workingTime}:<span>{props.time}</span></p>
          <p>{LANG[props.lang].report.distanceTravelled}:<span>{props.distance} m</span></p>
          <p>{LANG[props.lang].report.fuelConsumed}:<span>{props.fuel} l</span></p>
          <h3>{LANG[props.lang].report.logsCollected}:</h3>
          <ul>
            {Object.keys(props.logs).map(function(key) {
              return <li key={key}>{LANG[props.lang].logs['type'+(parseInt(key)+1)]}: <span>{props.logs[key]}</span></li>
            })}
          </ul>
          <hr/>
          <p><b>{LANG[props.lang].report.finalCost}:<span>{props.cost} €</span></b></p>
        </div>
      </div>
    </div>
  );
}
