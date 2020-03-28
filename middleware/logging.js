const winston = require('winston') ;


const logger = winston.createLogger({
  level: 'info',

  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
  ),
  defaultMeta: {
    // objects passed here will be put in all logs
    // service: 'user-service'
  },
  transports: [
    new winston.transports.File({filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/info.log', level : 'info' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.simple(),
    ),
    level:'silly'
  }));
}

module.exports = logger ;