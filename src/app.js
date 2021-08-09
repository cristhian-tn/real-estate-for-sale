const axios = require("axios").default;
const StrategyManager = require('./strategyManager');
const ScrapeStrategy = require('./scrapeStrategy');

module.exports = {
  handleEvent: async (event, context) => {
    validateEvent(event);
    const { address } = event;

    // Get Google response
    const resp = await axios.get(`https://www.google.com/search?q=${address}`);

    return isPropertyForSale(resp);
  },
};

function isPropertyForSale(resp) {
  const strategyManager = new StrategyManager();
  strategyManager.strategy = new ScrapeStrategy();
  // strategyManager.strategy = new RegexStrategy();
  const found = strategyManager.isPropertyForSale(resp.data);

  return found;
}

function validateEvent(event) {
  if (!event || !event.address || event.address.length < 10) {
    throw new Error(
      "'address' parameter is required and should be a real address"
    );
  }
}

