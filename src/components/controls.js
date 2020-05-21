import React from "react";

function Controls(props) {
  return (
    <div id="controlsContainer">
      <button id="buyButton" className="button">
        Buy
      </button>
      <input type="range" min="0" max="1" value="0.5" id="slider"></input>
      <button id="sellButton" className="button">
        Sell
      </button>
    </div>
  );
}

export default Controls;
