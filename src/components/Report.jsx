import React from 'react';
import './Report.css';
import Button from './Button';
import { LANG } from './lang';

export default function Report(props) {

  function showHideDetailedStats() {
    var stats = document.getElementById("detailed-stats");
    if (stats.style.display === "none") {
      stats.style.display = "block";
    } else {
      stats.style.display = "none";
    }

    var show = document.getElementById("show-report-details");
    var hide = document.getElementById("hide-report-details");
    if (show.style.display === "none") {
      show.style.display = "block";
      hide.style.display = "none";
    } else {
      show.style.display = "none";
      hide.style.display = "block";
    }
  }

  var date = new Date(props.enddate);

  if (props.close) {

    var dismiss = (<Button
                      id={'closeButton'}
                      buttonType={'close-or-delete'}
                      text={LANG[props.lang].report.close}
                      handleClick={props.close} />);
  }

  return (
    <div id={props.type == "endgame_report" ? "endgame-report" : "report"}>
      {dismiss}
      <h1>{LANG[props.lang].report.report}</h1> 
      <div id="report-header">
        <div>
          <p>{date.getDate()}.{date.getMonth()+1}.{date.getFullYear()}, {date.getHours()}:{date.getMinutes()<10?'0':''}{date.getMinutes()}</p>
          <p>{LANG[props.lang].report.map}: {props.mapname}</p>
        </div>
        <div>
          <h2>{LANG[props.lang].report.stats}</h2>
          <p>{LANG[props.lang].report.workingTime}:<span>{props.time}</span></p>
          <p>{LANG[props.lang].report.distanceTravelled}:<span>{props.distance} m</span></p>
          <p>{LANG[props.lang].report.fuelConsumed}:<span>{props.fuel} l</span></p>
          <Button
            id={'show-report-details'}
            handleClick={showHideDetailedStats}
            text={LANG[props.lang].report.details} />

          <Button
            id={'hide-report-details'}
            handleClick={showHideDetailedStats}
            text={LANG[props.lang].report.dismissDetails}
            style={{display: 'none'}} />

          <div id="detailed-stats" style={{display: 'none'}}>
            <div>
              <h3>{LANG[props.lang].detailedReport.time}</h3>
              <p>{LANG[props.lang].detailedReport.workingTime}: <span>{props.time}</span></p>
              <p>{LANG[props.lang].detailedReport.drivingUnloadedTime}: <span>{props.driving_unloaded_time}</span></p>
              <p>{LANG[props.lang].detailedReport.drivingLoadedTime}: <span>{props.driving_loaded_time}</span></p>
              <p>{LANG[props.lang].detailedReport.loadingUnloadingTime}: <span>{props.loading_and_unloading}</span></p>
              <p>{LANG[props.lang].detailedReport.idling}: <span>{props.idling}</span></p>

              <h3>{LANG[props.lang].detailedReport.distance}</h3>
              <p>{LANG[props.lang].detailedReport.distanceTravelled}: <span>{props.distance}</span></p>
              <p>{LANG[props.lang].detailedReport.drivingForwardTime}: <span>{props.driving_forward}</span></p>
              <p>{LANG[props.lang].detailedReport.drivingBackwardTime}: <span>{props.reverse}</span></p>
              <p>{LANG[props.lang].detailedReport.drivingUnloadedDistance}: <span>{props.driving_unloaded_distance}</span></p>
              <p>{LANG[props.lang].detailedReport.drivingLoadedDistance}: <span>{props.driving_loaded_distance}</span></p>

              <h3>{LANG[props.lang].detailedReport.costTitle}</h3>
              <p>{LANG[props.lang].detailedReport.fuelConsumed}: <span>{props.fuel}</span></p>
              <p>{LANG[props.lang].detailedReport.fuelCost}: <span>{props.fuel_cost}</span></p>
              <p>{LANG[props.lang].detailedReport.workerSalary}: <span>{props.worker_salary}</span></p>
              
              <h3>{LANG[props.lang].detailedReport.productivityTitle}</h3>
              <p>{LANG[props.lang].detailedReport.loadsTransported}: <span>{props.loads_transported}</span></p>
              <p>{LANG[props.lang].detailedReport.logsDeposited}: <span>{props.logs_deposited}</span></p>
              <p>{LANG[props.lang].detailedReport.totalVolume}: <span>{props.total_volume}</span></p>
              <p>{LANG[props.lang].detailedReport.productivity}: <span>{props.productivity}</span></p>
            </div>
          </div>
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
