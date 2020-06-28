import React from "react";
import "../styles/game.css";
import Legend from "../components/Legend.js";
import Scoreboard from "../components/Scoreboard.js";
import { scaleLinear, scaleUtc } from "d3-scale";
import { max, min } from "d3-array";
import { select } from "d3-selection";
import { axisBottom, axisRight } from "d3-axis";
import * as d3Shape from "d3-shape";
import { format } from "d3-format";
import {} from "d3-transition";
import { style } from "d3-selection";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 0.5,
      data: null,
      dataIndex: 0,
      timeframe: "ALL",
      dataTime: "",
      dataPrice: "",
      previousPrice: "",
      playerBuys: {
        time: "",
        price: "",
      },
      playerSells: {
        time: "",
        price: "",
      },
      aiBuys: {
        time: "",
        price: "",
      },
      aiSells: {
        time: "",
        price: "",
      },
    };
    this.createChart = this.createChart.bind(this);
    this.animateChart = this.animateChart.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
    this.createResults = this.createResults.bind(this);
    this.handleLowerBoundChange = this.handleLowerBoundChange.bind(this);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    fetch("/data").then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          const parsedData = {
            data: JSON.parse(data.data),
            stock: data.stock,
          };

          // Grab AI buys and sells and store them in state

          const aiBuys = parsedData.data.data
            .map((d, i) => {
              if (d[1] === 1 && !this.state.aiBuys.time) {
                return {
                  time: parsedData.data.index[i],
                  price: d[0],
                };
              }
            })
            .filter((d) => {
              if (d) return d;
            });

          const aiSells = parsedData.data.data
            .map((d, i) => {
              if (d[1] === -1 && !this.state.aiSells.time) {
                return {
                  time: parsedData.data.index[i],
                  price: d[0],
                };
              }
            })
            .filter((d) => {
              if (d && d.time > aiBuys[0].time) return d;
            });

          this.setState(
            {
              data: parsedData,
              dataTime: parsedData.data.index[0],
              aiBuys: aiBuys[0] ? aiBuys[0] : "",
              aiSells: aiSells[0] ? aiSells[0] : "",
            },
            this.createChart
          );
        });
      }
    });
  }

  /*componentDidUpdate() {
    this.animateChart();
  }*/

  createChart() {
    const chart = this.chartRef.current;
    const { data, stock } = this.state.data;
    const plotData = data.index.map((t, i) => [t, data.data[i]]);
    const margin = { top: 0, right: 0, bottom: 60, left: 0 };
    const width = 890;
    const height = 500;

    // Create axes for chart
    const x = scaleUtc().range([
      margin.left,
      width - margin.right - margin.left,
    ]);

    const y = scaleLinear().range([
      margin.top,
      height - margin.bottom - margin.top,
    ]);

    const gx = select(chart)
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")");

    const gy = select(chart)
      .append("g")
      .attr("id", "yAxis")
      .attr("transform", "translate(" + margin.left + ", 0)");

    //Create line for chart
    const line = d3Shape
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1][0]));

    const path = select(chart).append("path").attr("id", "path");

    const dots = select(chart)
      .selectAll("circle")
      .data(plotData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1][0]));

    //const title = select(chart)
    //.append("text")
    //.attr("id", "chartTitle")
    //.attr("x", width / 2 - 60)
    //.attr("y", margin.top)
    //.text(`${stock[1]} (${stock[0]})`);

    // ADD ALL NECESSARY VARIABLES TO PASS AND THEN ADD
    // animateChart() TO componentDidUpdate()
    this.animateChart(
      chart,
      x,
      y,
      gx,
      gy,
      line,
      path,
      dots,
      margin,
      width,
      height
    );
  }

  async animateChart(
    chart,
    x,
    y,
    gx,
    gy,
    line,
    path,
    dots,
    margin,
    width,
    height
  ) {
    const { data, stock } = this.state.data;
    const plotData = data.index.map((t, i) => [t, data.data[i]]);
    const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

    //async function changeDomain() {
    for (let i = 0; i < plotData.length; i++) {
      //Create transition
      //const transition = select(chart).transition().duration(400);

      //Adjust domain to current index
      let lowerIndex;
      switch (this.state.timeframe) {
        case "ALL":
          lowerIndex = 0;
          break;
        case "1D":
          lowerIndex = i - 1;
          break;
        case "1W":
          lowerIndex = i - 7;
          break;
        case "1M":
          lowerIndex = i - 22;
          break;
        case "3M":
          lowerIndex = i - 66;
          break;
        default:
          lowerIndex = 0;
          break;
      }

      console.log("lower index = ", lowerIndex);

      const currentDomain = plotData.slice(lowerIndex, i + 1);

      this.setState((state) => {
        return {
          dataIndex: i,
          dataTime: currentDomain[currentDomain.length - 1][0],
          dataPrice: currentDomain[currentDomain.length - 1][1][0],
          previousPrice: state.dataPrice,
        };
      });

      x.domain([plotData[lowerIndex][0], plotData[i][0]]);
      y.domain([
        max(currentDomain, (d) => d[1][0]) + 5,
        min(currentDomain, (d) => d[1][0]) - 5,
      ]);
      //Update axes and path
      gx.call(axisBottom(x).tickSizeOuter(0));
      gy.call(
        axisRight(y)
          .tickSize(width - margin.left - margin.right)
          .tickFormat(format(".2f"))
      );
      path.attr("d", line(plotData));

      dots
        .attr("cx", (d) => x(d[0]))
        .attr("cy", (d) => y(d[1][0]))
        .attr("class", (d) => {
          if (d[0] === this.state.playerBuys.time) return "dot playerBuy";
          if (
            d[0] === this.state.playerSells.time &&
            this.state.playerBuys.time
          )
            return "dot playerSell";
          if (d[0] === this.state.aiBuys.time) return "dot aiBuy";
          if (d[0] === this.state.aiSells.time && this.state.aiBuys.time)
            return "dot aiSell";
          return "dot";
        })
        .attr("r", 7);

      await delay((1 - this.state.speed) * 1000);
    }
    this.createResults();
  }

  createResults() {
    const wResults = 250;
    const hResults = 250;
    const w = window.outerWidth; //(window.innerWidth + window.outerWidth) / 2;
    const h = window.outerHeight; //(window.innerHeight + window.outerHeight) / 2;
    const centerHeight = (h - hResults) / 2;
    const centerWidth = (w - wResults) / 2;

    let playerROI = {
      who: "Player",
      return: 0,
    };
    let aiROI = {
      who: "AI",
      return: 0,
    };
    if (this.state.playerBuys.price) {
      let buy = this.state.playerBuys.price;
      let sell = this.state.playerSells.price
        ? this.state.playerSells.price
        : this.state.dataPrice;
      playerROI.return = (sell - buy) / buy;
    }

    if (this.state.aiBuys.price) {
      let buy = this.state.aiBuys.price;
      let sell = this.state.aiSells.price
        ? this.state.aiSells.price
        : this.state.dataPrice;
      aiROI.return = (sell - buy) / buy;
    }

    let startingPrice = this.state.data.data.data[0][0];
    let market = {
      who: "Market",
      return: (this.state.dataPrice - startingPrice) / startingPrice,
    };

    select("#chartContainer")
      .append("div")
      .html(() => {
        let sorted = [playerROI, aiROI, market]
          .sort((a, b) => b.return - a.return)
          .map((elem) => {
            elem.return = format(".2%")(elem.return);
            return elem;
          });
        return `<div id="resultsTitle">Results</div>
          <ul id="results-list">
            <li class="list-item">
              <span class="player-name">1. ${sorted[0].who}</span> 
              <span class="player-percent">${sorted[0].return}</span>
            </li>
            <li class="list-item">
              <span class="player-name">2. ${sorted[1].who}</span> 
              <span class="player-percent">${sorted[1].return}</span>
            </li>
            <li class="list-item">
              <span class="player-name">3. ${sorted[2].who}</span> 
              <span class="player-percent">${sorted[2].return}</span>
            </li>
          </ul>
          <button onclick="window.location.reload()" id="resultsButton">Play Again</button>`;
      })
      .attr("id", "resultsHTML")
      .style("top", -centerHeight + "px")
      .transition()
      .duration(1000)
      .style("top", centerHeight + "px");

    select("#root").append("div").attr("id", "darken-on-results");
  }

  handleClick(e) {
    console.log("e.target button: ", e.target.textContent);
    if (e.target.textContent === "Buy" && !this.state.playerBuys.time) {
      console.log("state set to BUY");
      this.setState((state) => {
        return {
          playerBuys: {
            time: state.data.data.index[state.dataIndex],
            price: state.data.data.data[state.dataIndex][0],
          },
        };
      }, console.log(this.state));
    }
    if (
      e.target.textContent === "Sell" &&
      this.state.playerBuys.time &&
      !this.state.playerSells.time
    ) {
      console.log("state set to SELL");
      this.setState((state) => {
        return {
          playerSells: {
            time: state.data.data.index[state.dataIndex],
            price: state.data.data.data[state.dataIndex][0],
          },
        };
      }, console.log(this.state));
    }
  }

  handleSlide(e) {
    console.log("inside handleSlide");
    console.log("e.target.value:", e.target.value);
    this.setState({
      speed: e.target.value,
    });
  }

  handleLowerBoundChange(e) {
    const currentIndex = this.state.dataIndex;
    switch (e.target.textContent) {
      case "ALL":
        console.log("state set to ALL");
        this.setState({ timeframe: "ALL" });
        break;
      case "1D":
        if (currentIndex - 1 > 0) {
          console.log("state set to 1D");
          this.setState({ timeframe: "1D" });
        }
        break;

      case "1W":
        if (currentIndex - 5 > 0) {
          console.log("state set to 1W");
          this.setState({ timeframe: "1W" });
        }
        break;
      case "1M":
        if (currentIndex - 22 > 0) {
          console.log("state set to 1M");
          this.setState({ timeframe: "1M" });
        }
        break;
      case "3M":
        if (currentIndex - 66 > 0) {
          console.log("state set to 3M");
          this.setState({ timeframe: "3M" });
        }
        break;
      default:
        console.log("default chosen set to ALL");
        this.setState({ timeframe: "ALL" });
        break;
    }
  }

  render() {
    return (
      <div id="chartContainer">
        <div className="col" id="col1">
          <Scoreboard
            time={this.state.dataTime}
            price={this.state.dataPrice}
            previousPrice={this.state.previousPrice}
            playerBuys={this.state.playerBuys}
            playerSells={this.state.playerSells}
            aiBuys={this.state.aiBuys}
            aiSells={this.state.aiSells}
          />
          <Legend />
        </div>
        <div className="col" id="col2">
          <div id="chart-title-container">
            <h2 id="chartTitle">{`${
              this.state.data ? this.state.data.stock[1] : ""
            } ${
              this.state.data ? "(" + this.state.data.stock[0] + ")" : ""
            }`}</h2>
            <div id="chart-title-price">{`${
              this.state.dataPrice
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(this.state.dataPrice)
                : ""
            }`}</div>
          </div>

          <svg
            id="chart"
            ref={this.chartRef}
            width={"890px"}
            height={"500px"}
          ></svg>
          <div id="controlsContainer">
            <div className="control-row one">
              <ul id="domain-toggle-list">
                <li
                  id="1D-li"
                  className={this.state.timeframe === "1D" ? "active-list" : ""}
                  onClick={this.handleLowerBoundChange}
                >
                  1D
                </li>
                <li
                  id="1W-li"
                  className={this.state.timeframe === "1W" ? "active-list" : ""}
                  onClick={this.handleLowerBoundChange}
                >
                  1W
                </li>
                <li
                  id="1M-li"
                  className={this.state.timeframe === "1M" ? "active-list" : ""}
                  onClick={this.handleLowerBoundChange}
                >
                  1M
                </li>
                <li
                  id="3M-li"
                  className={this.state.timeframe === "3M" ? "active-list" : ""}
                  onClick={this.handleLowerBoundChange}
                >
                  3M
                </li>
                <li
                  id="ALL-li"
                  className={
                    this.state.timeframe === "ALL" ? "active-list" : ""
                  }
                  onClick={this.handleLowerBoundChange}
                >
                  ALL
                </li>
              </ul>
              <hr></hr>
            </div>
            <div className="control-row two">
              <button
                onClick={this.handleClick}
                id="buyButton"
                className="button"
              >
                Buy
              </button>
              <div id="slideContainer">
                <label for="slider" id="sliderLabel">
                  Speed
                </label>
                <input
                  onChange={this.handleSlide}
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={this.state.speed}
                  id="slider"
                />
              </div>
              <button
                onClick={this.handleClick}
                id="sellButton"
                className="button"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
        {/*<div className="col" id="col3"></div>*/}
      </div>
    );
  }
}

export default Game;
