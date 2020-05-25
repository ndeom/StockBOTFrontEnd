import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import Robot from "../components/Robot.js";

function Home() {
  return (
    <div id="homeContainer" className="routeContainer">
      <div id="homeTitleContainer">
        <Robot />
        <h1 id="homeTitle">StockBOT</h1>
      </div>

      <br></br>
      <p>
        Welcome to StockBOT! You will be pitted against a machine-learning
        algorithm to see who can get the biggest return on investment. Here's
        how the game is played:
      </p>
      <ol id="gameRules">
        <li>A random stock and year will be chosen when you press "Start."</li>
        <li>
          The graph will start trending, and you can press "Buy" to purchase a
          stock on the current date.
        </li>
        <li>
          Once a stock has been purchased you can sell the stock on the current
          date by pressing "Sell," or you can hold the stock by not pressing
          anything and waiting for time to run out.
        </li>
        <li>
          Once time has ended, you will be ranked alongside the machine-learning
          algorithm and the market.
        </li>
        <li>May the best trader win!</li>
      </ol>
      <br></br>
      <Link to="/game">
        <button id="playButton">Play</button>
      </Link>
    </div>
  );
}

export default Home;
