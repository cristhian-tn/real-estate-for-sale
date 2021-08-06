const app = require('./src/app')

exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  try {
    const resp = app.handleEvent(event, context)
    return {
        success: true,
        data: resp
    }
  } catch(e) {
    return {
        success: false,
        error: {
            message: e.message || e
        }
    }
  }
}
