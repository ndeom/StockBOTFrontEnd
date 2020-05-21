import React from "react";
import "../styles/game.css";
import { scaleLinear, scaleUtc } from "d3-scale";
import { max, min } from "d3-array";
import { select } from "d3-selection";
import { axisBottom, axisRight } from "d3-axis";
import * as d3Shape from "d3-shape";
import { format } from "d3-format";
import {} from "d3-transition";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
    this.createChart = this.createChart.bind(this);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    fetch("/play").then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          const parsedData = {
            data: JSON.parse(data.data),
            stock: data.stock,
          };

          this.setState({ data: parsedData }, this.createChart);
        });
      }
    });
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const chart = this.chartRef.current;

    const { data, stock } = this.state.data;
    const margin = { top: 50, right: 0, bottom: 50, left: 0 };
    const width = 1000;
    const height = 650;

    const plotData = data.index.map((t, i) => [t, data.data[i]]);

    // Create axes for chart
    const x = scaleUtc()
      .domain([min(plotData, (d) => d[0]), max(plotData, (d) => d[0])]) //plotData[29][0]]
      .range([margin.left, width - margin.right]);

    const y = scaleLinear()
      .domain([max(plotData, (d) => d[1][0]), min(plotData, (d) => d[1][0])]) //plotData[29][1][0]
      .range([margin.top, height - margin.bottom]);

    const gx = select(chart)
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(axisBottom(x).tickSizeOuter(0));

    const gy = select(chart)
      .append("g")
      .attr("id", "yAxis")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(
        axisRight(y)
          .tickSize(width - margin.left - margin.right)
          .tickFormat(format(".2f"))
      );

    //Create line for chart
    const line = d3Shape
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1][0]));

    const path = select(chart)
      .append("path")
      .attr("id", "path")
      .attr("d", line(plotData));

    const title = select(chart)
      .append("text")
      .attr("id", "chartTitle")
      .attr("x", width / 2 - 60)
      .attr("y", margin.top)
      .text(`${stock}`);

    const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

    async function changeDomain() {
      for (let i = 29; i < plotData.length; i++) {
        //Create transition
        const transition = select(chart).transition().duration(400);
        //Adjust domain to current index
        const yDomain = plotData.slice(0, i + 1);

        x.domain([min(plotData, (d) => d[0]), plotData[i][0]]);
        y.domain([
          max(yDomain, (d) => d[1][0]) + 20,
          min(yDomain, (d) => d[1][0]) - 20,
        ]); //plotData[i][1][0] * 1.1
        //Update axes and path
        gx.call(axisBottom(x).tickSizeOuter(0));
        gy.call(
          axisRight(y)
            .tickSize(width - margin.left - margin.right)
            .tickFormat(format(".2f"))
        );
        path.attr("d", line(plotData));

        if (this.props.transaction === "buy") {
        }

        await delay(this.props.speed * 1000);
      }
    }
    //Initiate function for animation
    changeDomain();
  }

  render() {
    return (
      <svg
        id="chart"
        ref={this.chartRef}
        width={"1000px"}
        height={"650px"}
      ></svg>
    );
  }
}

export default Game;
