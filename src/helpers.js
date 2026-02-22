export const fmt = (n) => {
  if (n >= 1e7) return (n / 1e7).toFixed(2) + 'Cr';
  if (n >= 1e5) return (n / 1e5).toFixed(2) + 'L';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n;
};

export const getAQIColor = (aqi) => {
  if (aqi <= 50)  return '#00c964';
  if (aqi <= 100) return '#a3c940';
  if (aqi <= 150) return '#f5a623';
  if (aqi <= 200) return '#e84c1e';
  if (aqi <= 300) return '#b40032';
  return '#7b0031';
};

export const getAQILabel = (aqi) => {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Severe';
};

export const getAQIClass = (aqi) => {
  if (aqi <= 50)  return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'unhealthy';
  return 'severe';
};

export const getPctChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

export const getStateCities = (stateName, CITY_AQI) => {
  return CITY_AQI
    .filter(c => c.state === stateName)
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, 8);
};

export const getStateAvgAQI = (stateName, CITY_AQI) => {
  const cities = CITY_AQI.filter(c => c.state === stateName);
  if (!cities.length) return null;
  return (cities.reduce((a, c) => a + c.aqi, 0) / cities.length).toFixed(1);
};
