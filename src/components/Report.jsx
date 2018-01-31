import React from 'react';
import './Report.css';
import Button from './Button';
import { LANG } from './lang';

export default function Report(props) {

  function showHideDetailedStats() {
    var stats = document.getElementById("detailed-stats");
    if (stats.style.display === "none") {
      stats.style.display = "inline-block";
    } else {
      stats.style.display = "none";
    }

    var show = document.getElementById("show-report-details");
    var hide = document.getElementById("hide-report-details");
    if (show.style.display === "none") {
      show.style.display = "inline-block";
      hide.style.display = "none";
    } else {
      show.style.display = "none";
      hide.style.display = "inline-block";
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
    <div id={props.type === "endgame_report" ? "endgame-report" : "report"}>
      {dismiss}
      <h1>{LANG[props.lang].report.report}</h1> 
      <div id="report-header">
        <div>
          <div className="report-stat">{date.getDate()}.{date.getMonth()+1}.{date.getFullYear()}, {date.getHours()}:{date.getMinutes()<10?'0':''}{date.getMinutes()}</div>
          <div className="report-stat">{LANG[props.lang].report.map}: {props.mapname}</div>
        </div>
        <div>
          <h2>{LANG[props.lang].report.stats}</h2>
          <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].report.workingTime}:</div><div className="report-stat-value">{props.time}</div></div>
          <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].report.distanceTravelled}:</div><div className="report-stat-value">{props.distance} m</div></div>
          <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].report.fuelConsumed}:</div><div className="report-stat-value">{props.fuel} l</div></div>

          <div>
            <Button
            id={'show-report-details'}
            handleClick={showHideDetailedStats}
            buttonType={'mapmenu-show-type-button'}
            text={LANG[props.lang].report.details} />

            <Button
              id={'hide-report-details'}
              handleClick={showHideDetailedStats}
              buttonType={'mapmenu-show-type-button'}
              text={LANG[props.lang].report.dismissDetails}
              style={{display: 'none'}} />
          </div>

          <div id="detailed-stats" style={{display: 'none'}}>
            <h3>{LANG[props.lang].detailedReport.time}</h3>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.workingTime}:</div><div className="report-stat-value">{props.time}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.drivingUnloadedTime}:</div><div className="report-stat-value">{props.driving_unloaded_time}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.drivingLoadedTime}:</div><div className="report-stat-value">{props.driving_loaded_time}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.loadingUnloadingTime}:</div><div className="report-stat-value">{props.loading_and_unloading}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.idling}:</div><div className="report-stat-value">{props.idling}</div></div>

            <h3>{LANG[props.lang].detailedReport.distance}</h3>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.distanceTravelled}:</div><div className="report-stat-value">{props.distance}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.drivingForwardTime}:</div><div className="report-stat-value">{props.driving_forward}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.drivingBackwardTime}:</div><div className="report-stat-value">{props.reverse}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.drivingUnloadedDistance}:</div><div className="report-stat-value">{props.driving_unloaded_distance}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.drivingLoadedDistance}:</div><div className="report-stat-value">{props.driving_loaded_distance}</div></div>

            <h3>{LANG[props.lang].detailedReport.costTitle}</h3>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.fuelCost}:</div><div className="report-stat-value">{props.fuel_cost}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.workerSalary}:</div><div className="report-stat-value">{props.worker_salary}</div></div>
            
            <h3>{LANG[props.lang].detailedReport.productivityTitle}</h3>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.loadsTransported}:</div><div className="report-stat-value">{props.loads_transported}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.logsDeposited}:</div><div className="report-stat-value">{props.logs_deposited}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.totalVolume}:</div><div className="report-stat-value">{props.total_volume}</div></div>
            <div className="report-stat"><div className="report-stat-header">{LANG[props.lang].detailedReport.productivity}:</div><div className="report-stat-value">{props.productivity}</div></div>
          </div>
          <h3>{LANG[props.lang].report.logsCollected}:</h3>
          <ul>
            {Object.keys(props.logs).map(function(key) {
              return <li key={key}><div className="report-stat-header">{LANG[props.lang].logs['type'+(parseInt(key,10)+1)]}:</div><div className="report-stat-value">{props.logs[key]}</div></li>
            })}
          </ul>
          <hr/>
          <div className="report-stat"><b><div className="report-stat-header">{LANG[props.lang].report.finalCost}:</div><div className="report-stat-value">{props.cost} €</div></b></div>
        </div>
      </div>
    </div>
  );
}
