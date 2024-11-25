let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

c.width = 500;
c.height = 500;
c.style.background = "#000";
ctx.lineWidth = 3;

const STARTING_INPUT_ID = "startingY";
const ENDING_INPUT_ID = "endingY";

let points = [[0, 0], [1, 1]];

const renderGraph = (graph, samples, minX, maxX, minY, maxY) => {
  graph = graph.lerpFrom(minX, maxX, minY, maxY);
  let start = graph.evaluate(graph.min);
  ctx.beginPath();
  ctx.moveTo(graph.min*500, 1000 - start*1000);
  const step = (graph.max-graph.min)/samples;
  for (let x=graph.min+step; x<=graph.max; x+=step) {
    ctx.lineTo(x*500, 1000 - graph.evaluate(x)*1000);
  }
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

const renderPoint = (point, minY, maxY) => {
  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  let y = (point[1]-minY)/(maxY-minY);
  ctx.arc(point[0]*500, 1000 - y*1000, 10, 0, 2*Math.PI);
  ctx.stroke();
}

const verticalLine = x => {
  ctx.beginPath();
  ctx.moveTo(x*500, 1000);
  ctx.lineTo(x*500, 0);
  ctx.stroke();
}

const horizontalLine = (y, minY, maxY) => {
  y = (y-minY)/(maxY-minY);
  ctx.beginPath();
  ctx.moveTo(-250, 1000 - y*1000);
  ctx.lineTo(750, 1000 - y*1000);
  ctx.stroke();
}

const renderAxes = (minY, maxY) => {
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 3;  
  for (let x=-0.5; x<=1.5; x+=0.1) {
    verticalLine(x);
  }

  let orderOfMagnitude = Math.floor(Math.log10((maxY-minY)));
  let offset = Math.pow(10, orderOfMagnitude-1);
  let k = Math.floor(minY/offset);
  for (let y=k; y<=maxY; y += offset) {
    horizontalLine(y, minY, maxY);
  }
  console.log(offset);

  ctx.strokeStyle = "#ccc";
  horizontalLine(0, minY, maxY);
  verticalLine(0);
}

const updateScreen = () => {
  let minY = getMinY();
  let maxY = getMaxY();

  ctx.clearRect(0, 0, c.width, c.height);

  ctx.save();
  ctx.scale(0.5, 0.5);
  ctx.translate(250, 0);

  renderAxes(minY, maxY);

  for (let point of points) {
    renderPoint(point, minY, maxY);
  }

  if (points.length >= 2) {
    let graph = Graph.fromManyPoints(points);
    renderGraph(graph, getSamples(), 0, 1, minY, maxY);
    saveFile();
  }

  ctx.restore();
}

updateScreen();

window.addEventListener("mousedown", e => {
  if (e.target != c) return;
  e.preventDefault();

  let maxY = getMaxY();
  let minY = getMinY();
  
  let point = [e.offsetX/250 - 0.5, 1 - (e.offsetY/500)];
  point[1] = point[1]*(maxY-minY) + minY;

  if (e.button == 0) {
    if (point[0] > 0 && point[0] < 1)
      points.push(point);
    points.sort((a, b) => a[0]-b[0]);
    updateScreen();
  } else if (e.button == 2) {
    const distance = (a, b) => Math.sqrt((b[1]-a[1])*(b[1]-a[1]) + (b[0]-a[0])*(b[0]-a[0]));
    for (let i=points.length-2; i>=1; i--) {
      if (distance(point, points[i]) <= 10/500) {
        points.splice(i, 1);
      }
    }
    updateScreen();
  }
});

document.getElementById(STARTING_INPUT_ID).onchange = () => {
  points[0][1] = getInput(STARTING_INPUT_ID);
  updateScreen();
}

document.getElementById(ENDING_INPUT_ID).onchange = () => {
  points[points.length-1][1] = getInput(ENDING_INPUT_ID);
  updateScreen();
}

document.getElementById("outputSamples").onchange = document.getElementById("graphName").onchange = document.getElementById("samples").onchange = document.getElementById("minY").onchange = document.getElementById("maxY").onchange = document.getElementById("outputDecimalPlaces").onchange = updateScreen;

c.oncontextmenu = e => {
  return false;
}
