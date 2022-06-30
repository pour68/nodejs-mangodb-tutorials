const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const logEvents = async (msg) => {
  const date = `${format(new Date(), "yyyy/MM/dd\thh:mm:ss")}`;
  const logMsg = `${date}\t${uuid()}\t${msg}\n`;

  try {
    const logFolderPath = path.join(__dirname, "..", "logs");
    const logFilePath = path.join(__dirname, "..", "logs", "requestLog.txt");
    if (!fs.existsSync(logFolderPath)) await fsPromises.mkdir(logFolderPath);

    await fsPromises.appendFile(logFilePath, logMsg);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  next();
};

module.exports = { logger, logEvents };
