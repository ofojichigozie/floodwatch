const RAIN_SENSOR_MAX = 1024;

export const toRainPercent = (rainIntensity: number) => {
  const clamped = Math.max(0, Math.min(RAIN_SENSOR_MAX, rainIntensity));
  return Number((((RAIN_SENSOR_MAX - clamped) / RAIN_SENSOR_MAX) * 100).toFixed(1));
};

export const formatRainPercent = (rainIntensity: number) => {
  return `${toRainPercent(rainIntensity).toFixed(0)}%`;
};
