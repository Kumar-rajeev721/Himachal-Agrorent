const createGoogleMapsUrl = (location) => {
  if (!location) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

module.exports = {
  createGoogleMapsUrl,
};
