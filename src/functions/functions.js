const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

function appendMarker(chart, plotData, i, x, y, transaction) {
  select(chart)
    .append("circle")
    .attr("class", `${transaction}`)
    .attr(
      "cx",
      x((plotData) => plotData[i][0])
    )
    .attr(
      "cy",
      y((plotData) => plotData[i][1][0])
    )
    .attr("r", 6);
}

async function changeDomain(i, plotData, chart, x, y, gx, gy, path, speed) {
  for (i = 29; i < plotData.length; i++) {
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

    await delay(speed * 1000);
  }
}

export { delay, appendMarker, changeDomain };
