const getInput = id => {
  let element = document.getElementById(id);
  if (element) {
    return element.value != null && element.value != undefined && !isNaN(parseFloat(element.value)) ? parseFloat(element.value) : 0;
  } else return null;
}

const getSamples = () => {
  let samples = getInput("samples");
  if (samples <= 0) return 100;
  else return samples;
}

const getMinY = () => getInput("minY");
const getMaxY = () => getInput("maxY");

const getGraphName = () => document.getElementById("graphName").value;

const getOutputSamples = () => {
  let samples = getInput("outputSamples");
  if (samples <= 0) return 100;
  else return samples;
}
