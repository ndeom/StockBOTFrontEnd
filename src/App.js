import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import Game from "./routes/Game.js";
import Controls from "./components/controls.js";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      transaction: null,
      speed: 0.5,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
  }

  handleClick(e) {
    if (e.currentTarget.textContent === "Buy" && !this.state.transaction) {
      this.setState({
        transaction: "buy",
      });
    }
    if (
      e.currentTarget.textContent === "Sell" &&
      this.state.transaction === "buy"
    ) {
      this.setState({
        transaction: "sell",
      });
    }
  }

  handleSlide(e) {
    this.setState({
      speed: e.currentTarget.value,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/play">
            <div id="gameContainer">
              <Game
                transaction={this.state.transaction}
                speed={this.state.speed}
              />
              <Controls
                handleClick={this.handleClick}
                handleSlide={this.handleSlide}
              />
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
