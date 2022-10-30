const {format,createLogger,transports} = require('winston');
const {combine,timestamp,colorize,errors,json}=format;
function buildProLogger(){
  return createLogger({
    level: 'info',
    format: combine(
      timestamp(),
      colorize(),
      errors({stack: true}),
      json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.Console()
    ],
  });
} 
module.exports=buildProLogger;
