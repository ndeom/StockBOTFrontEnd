import React from "react";
import "../styles/legend.css";

function Legend() {
  return (
    <div id="legendContainer">
      <h1 id="legendTitle">Legend</h1>
      <div className="legendRow">
        <svg className="svgCircle" width="14" height="14">
          <circle id="playerBuyLegend" cx="7" cy="7" r="7"></circle>
        </svg>
        <div className="legendText">Player Buy</div>
      </div>
      <div className="legendRow">
        <svg className="svgCircle" width="14" height="14">
          <circle id="playerSellLegend" cx="7" cy="7" r="7"></circle>
        </svg>
        <div className="legendText">Player Sell</div>
      </div>
      <div className="legendRow">
        <svg className="svgCircle" width="16" height="16">
          <circle id="aiBuyLegend" cx="8" cy="8" r="7"></circle>
        </svg>
        <div className="legendText">AI Buy</div>
      </div>
      <div className="legendRow">
        <svg className="svgCircle" width="16" height="16">
          <circle id="aiSellLegend" cx="8" cy="8" r="7"></circle>
        </svg>
        <div className="legendText">AI Sell</div>
      </div>
    </div>
  );
}

export default Legend;
