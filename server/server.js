const express = require("express");
const app = express();
app.use(express.json());

const routes = require("./routes/user_login");
const reviewer_routes = require("./routes/reviewer_dashboard");
const getfileData = require("./routes/audio2text");

const cookie_parser = require("cookie-parser");
app.use(cookie_parser());

const cors = require("cors");
app.use(cors());

const pool = require("./config/db");

// Create logger
const { createLogger, format, transports, info } = require("winston");
const winston = require("winston/lib/winston/config");
const logger = createLogger({
  //   transports: [new transports.Console()],
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log", level: "info" }),
  ],
});

logger.log({
  level: "info",
  message: "Passed an object",
  additional: "properties",
  are: "passed along",
});
function logRequest(req, res, next) {
  logger.info(req.url);
  next();
}
app.use(logRequest);

function logError(req, res, next) {
  logger.error(req.url);
  next();
}
app.use(logError);

app.use("/api", routes);
app.use("/api", reviewer_routes);
app.use("/a2t", getfileData);
const port = 3002 || process.env.PORT;
app.listen(port, () => console.log(`Server is running in ${port}`));
