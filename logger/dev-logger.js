const { format, createLogger, transports } = require('winston');

const {
  combine, timestamp, printf, errors, colorize,
} = format;
require('winston-mongodb');

function buildDevLogger() {
  const logformat = printf(({ level, message, stack }) => {
    // eslint-disable-next-line no-unused-expressions
    `${timestamp} ${level} ${stack || message}`;
  });
  return createLogger({
    level: 'silly', // 'debug',//'verbose',//'http',//'info',//'warn',//'error',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logformat,
    ),
    defaultMeta: { service: 'user-service' },
    // transports: [
    //   new transports.File({ filename: 'error.log', level: 'error' }),
    //   new transports.File({ filename: 'combined.log' }),
    //   new transports.MongoDB({
    //     db: 'mongodb://localhost:27017/chatbox?retryWrites=true&w=majority',
    //     collection: 'loggers',
    //     useUnifiedTopology: true,
    //   }),
    //   new transports.Console(),
    // ],
  });
}
module.exports = buildDevLogger;
