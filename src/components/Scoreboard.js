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
      <div className="scoreboard-row">
        <span id="current-date" className="stats">
          Current Date
        </span>
        <div className="statsText time">{date.toString()}</div>
      </div>
      <div className="scoreboard-row">
        <span className="stats">Current Price</span>
        <div className="statsGroup">
          <div className="statsText price">
            {props.price
              ? `${new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(props.price)}`
              : ""}
          </div>
        </div>
      </div>
      <div className="scoreboard-row">
        <span className="stats">Player Buy</span>
        <div className="statsText price buy">
          {props.playerBuys.price
            ? `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(props.playerBuys.price)}`
            : ""}
        </div>
      </div>
      <div className="scoreboard-row">
        <span className="stats">Player Sell</span>
        <div className="statsText price sell">
          {props.playerSells.price
            ? `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(props.playerSells.price)}`
            : ""}
        </div>
      </div>
      <div className="scoreboard-row">
        <span className="stats">AI Buy</span>
        <div className="statsText price buy">
          {props.aiBuys.price && props.time >= props.aiBuys.time
            ? `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(props.aiBuys.price)}`
            : ""}
        </div>
      </div>
      <div className="scoreboard-row">
        <span className="stats">AI Sell</span>
        <div className="statsText price sell">
          {props.aiSells.price && props.time >= props.aiSells.time
            ? `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(props.aiSells.price)}`
            : ""}
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;
