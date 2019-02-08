export function getOutput() {
  const result = Object.assign({}, DataCollector.getAll());
  for (let key in result['LineGroup']) {
    delete result['LineGroup'][key].from;
    delete result['LineGroup'][key].to;
  }

  return { dataJSON: JSON.stringify(result) };
}
