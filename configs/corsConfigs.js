const allowOrigins = require("./allowOrigins");

const corsConfigs = {
  origin: function (origin, callback) {
    if (allowOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log(origin);

      callback(new Error("Not allow by cors"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsConfigs;
