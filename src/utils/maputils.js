import numberFormatter from './numberformatter';

function roundScale(scale) {
  let scaleValue = scale;
  const differens = scaleValue % 10;
  if (differens !== 0) {
    scaleValue += (10 - differens);
  }
  return scaleValue;
}

function resolutionToScale(resolution, projection) {
  const dpi = 25.4 / 0.28;
  const mpu = projection.getMetersPerUnit();
  let scale = resolution * mpu * 39.37 * dpi;
  scale = Math.round(scale);
  return scale;
}

function resolutionToFormattedScale(resolution, projection) {
  const scale = roundScale(resolutionToScale(resolution, projection));
  return `1:${numberFormatter(scale)}`;
}

export default {
  resolutionToScale,
  resolutionToFormattedScale
};
