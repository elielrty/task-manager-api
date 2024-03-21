import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.simple()),
  transports: [new winston.transports.Console()],
})

const loggerError = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.simple(),
    winston.format.printf(info => {
      return `${info.timestamp} [${info.level}]: ${info.message} ${
        info.stack || ''
      }`
    }),
  ),
  transports: [new winston.transports.Console()],
})

export { logger, loggerError }
