const winston = require('winston');
let mydate = new Date();
const newFilename = mydate.getFullYear() + "-" + mydate.getMonth() + "-" + mydate.getDate() + "-" + "feker.log";
module.exports.logger =  winston.createLogger({
  
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: newFilename,
      json: true,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json())
    }),
   
  ]
});