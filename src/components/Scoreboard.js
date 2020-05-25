import React from "react";
import "../styles/scoreboard.css";

function Scoreboard(props) {
  let date = new Date(props.time);
  if (typeof props.time === "number") {
    date = new Intl.DateTimeFormat("en-US").format(date);
  }

  return (
    <div id="scoreboardContainer">
      <h1 id="scoreboardTitle">Stats</h1>
      <h2 className="stats">Current Date</h2>
      <div className="statsText time">{date.toString()}</div>
      <h2 className="stats">Current Price</h2>
      <div className="statsGroup">
        <svg id="trendSVG" height="16" width="16">
          <polygon
            className={`${
              props.price >= props.previousPrice ? "trendUp" : "trendDown"
            }`}
            points={`${
              props.price >= props.previousPrice
                ? "8,0 16,16 0,16"
                : "0,0 16,0 8,16"
            }`}
          />
        </svg>
        <div className="statsText price">{props.price}</div>
      </div>
      <h2 className="stats">Player Buy</h2>
      <div className="statsText price buy">{props.playerBuys.price}</div>
      <h2 className="stats">Player Sell</h2>
      <div className="statsText price sell">{props.playerSells.price}</div>
      <h2 className="stats">AI Buy</h2>
      <div className="statsText price buy">
        {props.time >= props.aiBuys.time ? props.aiBuys.price : ""}
      </div>
      <h2 className="stats">AI Sell</h2>
      <div className="statsText price sell">
        {props.time >= props.aiSells.time ? props.aiSells.price : ""}
      </div>
    </div>
  );
}

export default Scoreboard;
