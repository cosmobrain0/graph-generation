const saveFile = () => {
  let outputSamples = getOutputSamples();
  let graph = Graph.fromManyPoints(points);

  let dp = getOutputDecimalPlaces();

  let sampledPoints = new Array(outputSamples).fill(0).map((_, i) => i/(outputSamples-1)).map(x => [x, graph.evaluate(x)]).map(([x, y]) => [x.toFixed(dp), y.toFixed(dp)]);
  document.getElementById("output").innerText = getGraphName() + " - " + sampledPoints.map(p => `${p[0]},${p[1]}`).join(" ; ");
}
