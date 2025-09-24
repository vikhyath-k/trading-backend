const cacheStore = {};

const getCachedData = (key) => {
  const entry = cacheStore[key];
  if (!entry) return null;

  const { timestamp, data, duration } = entry;
  const now = Date.now();
  if (now - timestamp < duration) {
    return data;
  }

  // Expired
  delete cacheStore[key];
  return null;
};

const setCachedData = (key, data, duration = 60000) => {
  cacheStore[key] = {
    data,
    timestamp: Date.now(),
    duration,
  };
};

module.exports = { getCachedData, setCachedData };
