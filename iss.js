const request = require("request");

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error);
    }
    fetchCoordsByIp(ip, (error, coords) => {
      if (error) {
        callback(error);
      }
      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        if (error) {
          callback(error);
        }
        console.log(passTimes);
        callback(null, passTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };

//ISS Spotter III
const fetchISSFlyOverTimes = function(coords ,callback) {
  request(`http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Response statuseCode: ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const passTimes = JSON.parse(body).response;
    callback(null, passTimes);
  });
};

//module.exports = { fetchISSFlyOverTimes };



const fetchCoordsByIp = function(IPV4, callback) {
  request(`https://freegeoip.app/json/${IPV4}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    };
    if (response.statusCode !== 200) {
      callback(Error(`Response statsus ${response.statusCode} when receiving IPV4. Reponse is : ${body}`), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  });
};

//module.exports = { fetchCoordsByIp };

const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      callbacl(Error(`Response statusCode: ${response.statusCode} when fetching ip. Response: ${body}`), null);
    }
    const JSONParsed = JSON.parse(body);
    callback(null, JSONParsed.ip);
  });
};

//module.exports = { fetchMyIP };

