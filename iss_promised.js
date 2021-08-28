const request = require('request-promise-native');

const fetchMyIP = () => request('https://api.ipify.org/?format=json');

/*
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = body => {
  let ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = body => {
  let coords = {};
  coords.latitude = JSON.parse(body).latitude;
  coords.longitude = JSON.parse(body).longitude;
  const lat = coords.latitude;
  const lon = coords.longitude;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      let response =  JSON.parse(data).response;
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };