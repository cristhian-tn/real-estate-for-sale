const app = require('./src/app')
const { logger } = require('./src/logger')

exports.handler = async (event, context) => {
  logger.info(`EVENT: ${JSON.stringify(event)}`)
  try {
    const resp = app.handleEvent(event, context)
    return {
      success: true,
      data: resp
    }
  } catch (e) {
    return {
      success: false,
      error: {
        message: e.message || e
      }
    }
  }
}
