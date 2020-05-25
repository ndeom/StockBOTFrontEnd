import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import Game from "./routes/Game.js";
import Controls from "./components/controls.js";

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
