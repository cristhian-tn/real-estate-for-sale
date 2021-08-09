const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'unison-google-alert-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `google-alert-combined.log`.
    // - Write all logs error (and below) to `google-alert-error.log`.
    //
    new transports.File({ filename: 'google-alert-error.log', level: 'error' }),
    new transports.File({ filename: 'google-alert-combined.log' })
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = {
  logger
}